import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';

interface FilaEstructura {
  asignaturaNombre: string;
  nivel: number;
  jornada: string;
  paralelo: string;
  cupo: number;
  cupoOcupado: number;
  horario: string;
  docenteNombre: string;
  estado: string;
  mallaNombre: string;
  mallaEstado: string;
}

@Component({
  selector: 'app-estructura-curricular',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estructura-curricular.html',
  styleUrl: './estructura-curricular.scss',
})
export class EstructuraCurricular implements OnInit {
  private service = inject(EstructuraAcademicaService);

  // Filtros y Selección
  carreras: any[] = [];
  periodos: any[] = [];
  carreraId = '';
  periodoId = '';
  terminoBusqueda = '';

  cargando = false;
  detallesMallaOrdenados: FilaEstructura[] = [];

  ngOnInit(): void {
    this.cargarFiltros();
  }

  cargarFiltros(): void {
    this.service.listarCarreras().subscribe({
      next: (d) => (this.carreras = d),
      error: (e) => console.error('Error cargando carreras:', e),
    });

    this.service.listarPeriodos().subscribe({
      next: (d) => (this.periodos = d),
      error: (e) => console.error('Error cargando periodos:', e),
    });
  }

  buscarEstructura(): void {
    if (!this.carreraId || !this.periodoId) {
      alert('Selecciona una carrera y un periodo académico.');
      return;
    }

    this.cargando = true;
    this.detallesMallaOrdenados = [];

    this.service
      .listarPeriodoCarrera({ periodoId: this.periodoId, carreraId: this.carreraId })
      .pipe(
        switchMap((periodoCarreras: any[]) => {
          if (!periodoCarreras || periodoCarreras.length === 0) {
            return of([]);
          }

          // Consultamos de forma paralela todas las jornadas vinculadas
          const peticionesJornadas = periodoCarreras.map((pc) =>
            this.procesarPeriodoCarrera(pc)
          );
          return forkJoin(peticionesJornadas).pipe(
            map((resultados) => resultados.flat())
          );
        })
      )
      .subscribe({
        next: (filas) => {
          this.detallesMallaOrdenados = this.ordenarJerarquicamente(filas);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error procesando la estructura:', err);
          this.cargando = false;
        },
      });
  }

  private procesarPeriodoCarrera(pc: any) {
    const jornada = pc.jornada || 'MATUTINA';
    const mallaNombre = pc.versionMalla?.nombre || 'Malla General';
    const mallaEstado = pc.versionMalla?.estado || 'ACTIVO';

    return this.service.listarNiveles(pc.versionMalla?.id).pipe(
      switchMap((niveles: any[]) => {
        if (!niveles || niveles.length === 0) return of([]);

        const peticionesNiveles = niveles.map((nivel) =>
          this.service.listarParalelos(pc.id).pipe(
            switchMap((paralelos: any[]) => {
              const paralelosNivel = paralelos.filter((p) => p.nivel?.id === nivel.id);
              if (paralelosNivel.length === 0) return of([]);

              const peticionesParalelos = paralelosNivel.map((paralelo) =>
                forkJoin({
                  asigs: this.service.listarAsignaturaParalelo(paralelo.id).pipe(catchError(() => of([]))),
                  horarios: this.service.listarHorariosPorParalelo(paralelo.id).pipe(catchError(() => of([]))),
                }).pipe(
                  map(({ asigs, horarios }) =>
                    asigs.map((ap: any) => {
                      const misHorarios = horarios
                        .filter((h: any) => h.asignaturaParalelo?.id === ap.id)
                        .map((h: any) => `${h.dia} ${h.horaInicio}-${h.horaFin}`)
                        .join(' | ');

                      return {
                        asignaturaNombre: ap.detalleMalla?.asignatura?.nombre || 'Sin Nombre',
                        nivel: Number(nivel.numero) || 1,
                        jornada: jornada,
                        paralelo: paralelo.nombre || 'A',
                        cupo: paralelo.cupoMaximo || 30,
                        cupoOcupado: ap.cupoOcupado || 0,
                        horario: misHorarios || 'Por asignar',
                        docenteNombre: ap.docente ? `${ap.docente.nombres} ${ap.docente.apellidos}` : 'Sin asignar',
                        estado: ap.cupoOcupado >= paralelo.cupoMaximo ? 'LLENO' : 'DISPONIBLE',
                        mallaNombre: mallaNombre,
                        mallaEstado: mallaEstado,
                      } as FilaEstructura;
                    })
                  )
                )
              );

              return forkJoin(peticionesParalelos).pipe(map((res) => res.flat()));
            }),
            catchError(() => of([]))
          )
        );

        return forkJoin(peticionesNiveles).pipe(map((res) => res.flat()));
      }),
      catchError(() => of([]))
    );
  }

  // --- ORDENAMIENTO JERÁRQUICO DE DATOS ---
  private ordenarJerarquicamente(lista: FilaEstructura[]): FilaEstructura[] {
    const ordenJornada: Record<string, number> = {
      MATUTINA: 1,
      VESPERTINA: 2,
      NOCTURNA: 3,
    };

    return lista.sort((a, b) => {
      // 1. Prioridad por Nivel (1er al 6to Semestre)
      if (a.nivel !== b.nivel) {
        return a.nivel - b.nivel;
      }

      // 2. Prioridad por Jornada (Matutina -> Vespertina -> Nocturna)
      const jA = ordenJornada[a.jornada.toUpperCase()] || 99;
      const jB = ordenJornada[b.jornada.toUpperCase()] || 99;
      if (jA !== jB) {
        return jA - jB;
      }

      // 3. Alfabetico por Asignatura
      return a.asignaturaNombre.localeCompare(b.asignaturaNombre);
    });
  }

  // --- FILTRADO DINÁMICO EN FRONTEND ---
  get filasFiltradas(): FilaEstructura[] {
    if (!this.terminoBusqueda.trim()) {
      return this.detallesMallaOrdenados;
    }
    const busqueda = this.terminoBusqueda.toLowerCase().trim();
    return this.detallesMallaOrdenados.filter(
      (item) =>
        item.asignaturaNombre.toLowerCase().includes(busqueda) ||
        item.docenteNombre.toLowerCase().includes(busqueda) ||
        item.jornada.toLowerCase().includes(busqueda) ||
        `nivel ${item.nivel}`.includes(busqueda) ||
        `par. ${item.paralelo.toLowerCase()}`.includes(busqueda)
    );
  }
}