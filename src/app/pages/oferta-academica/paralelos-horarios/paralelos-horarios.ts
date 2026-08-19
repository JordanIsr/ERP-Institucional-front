import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EstructuraAcademicaService } from '../../../core/service/estructura-academica.service';
import { ParalelosService, Aula, ParaleloPayload } from '../../../core/service/paralelos.service';

@Component({
  selector: 'app-paralelos-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './paralelos-horarios.html',
  styleUrl: './paralelos-horarios.scss'
})
export class ParalelosHorarios implements OnInit {
  private estructuraService = inject(EstructuraAcademicaService);
  private paralelosService = inject(ParalelosService);

  periodosCarrera: any[] = [];
  nivelesMalla: any[] = [];
  aulas: Aula[] = [];
  docentes: any[] = [];
  paralelos: any[] = [];
  detallesNivel: any[] = [];
  asignaturasParalelo: any[] = [];
  paraleloGestionId = '';
  docentePorDetalle: Record<string, string> = {};
  error = '';
  mensaje = '';
  cargandoCatalogos = true;

  // Formulario Dinámico
  periodoCarreraId = '';
  nivelId = '';
  nombreParalelo = 'Paralelo A';
  aulaSeleccionadaId = '';
  cupoAuto = 0;

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    forkJoin({
      ofertas: this.estructuraService.listarPeriodoCarrera(),
      docentes: this.estructuraService.listarDocentes(),
      aulas: this.paralelosService.listarAulas(),
    }).subscribe({
      next: ({ ofertas, docentes, aulas }: any) => {
        this.periodosCarrera = ofertas.filter((oferta: any) => oferta.estado === 'ACTIVA' && oferta.periodo?.estado !== 'CERRADO');
        this.docentes = docentes.filter((docente: any) => docente.estado === 'ACTIVO');
        this.aulas = aulas;
        this.cargandoCatalogos = false;
      },
      error: (e: any) => {
        this.error = e.error?.message || 'No se pudieron cargar ofertas, docentes o aulas.';
        this.cargandoCatalogos = false;
      },
    });
  }

  // Al seleccionar el Periodo-Carrera, cargamos sus niveles asociados
  alCambiarPeriodo(): void {
    if (!this.periodoCarreraId) {
      this.nivelesMalla = [];
      return;
    }

    const oferta = this.periodosCarrera.find((item) => item.id === this.periodoCarreraId);
    if (oferta?.versionMalla?.id) {
      this.estructuraService.listarNiveles(oferta.versionMalla.id).subscribe({
        next: (niveles: any[]) => {
          this.nivelesMalla = niveles;
          if (niveles.length === 0) this.error = 'La malla heredada por esta oferta no tiene niveles.';
        },
        error: () => { this.nivelesMalla = []; this.error = 'No se pudieron cargar los niveles de la malla heredada.'; }
      });
    }
    this.nivelId = '';
    this.paralelos = [];
    this.detallesNivel = [];
    this.paraleloGestionId = '';
  }

  get requisitosPendientes(): string[] {
    const pendientes: string[] = [];
    if (this.periodosCarrera.length === 0) pendientes.push('una oferta académica en “Periodos”');
    if (this.aulas.length === 0) pendientes.push('un aula activa en “Catálogos > Aulas”');
    if (this.docentes.length === 0) pendientes.push('un docente activo en “Catálogos > Docentes”');
    return pendientes;
  }

  alCambiarNivel(): void {
    this.paraleloGestionId = '';
    this.asignaturasParalelo = [];
    if (!this.nivelId) {
      this.paralelos = [];
      this.detallesNivel = [];
      return;
    }
    this.estructuraService.listarParalelos(this.periodoCarreraId).subscribe({
      next: (paralelos: any[]) => (this.paralelos = paralelos.filter((p) => p.nivel?.id === this.nivelId)),
      error: () => (this.paralelos = []),
    });
    this.estructuraService.listarDetalleMalla(this.nivelId).subscribe({
      next: (detalles: any[]) => {
        this.detallesNivel = detalles;
        if (detalles.length === 0) this.error = 'El nivel seleccionado no tiene asignaturas configuradas.';
      },
      error: () => { this.detallesNivel = []; this.error = 'No se pudieron cargar las asignaturas del nivel.'; },
    });
  }

  // Automatización de cupos desde el catálogo de Aulas
  alSeleccionarAula(): void {
    const aulaEncontrada = this.aulas.find(a => a.id === this.aulaSeleccionadaId);
    this.cupoAuto = aulaEncontrada ? aulaEncontrada.capacidadMaxima : 0;
  }

  guardarParalelo(): void {
    this.error = '';
    this.mensaje = '';
    if (!this.periodoCarreraId || !this.nivelId || !this.nombreParalelo || !this.aulaSeleccionadaId || this.cupoAuto < 1) {
      this.error = 'Completa oferta, nivel, nombre, aula y cupo máximo.';
      return;
    }

    // Payload corregido alineado con la interfaz del servicio
    const payload: ParaleloPayload = {
      periodoCarreraId: this.periodoCarreraId,
      nivelId: this.nivelId,
      nombre: this.nombreParalelo,
      aulaId: this.aulaSeleccionadaId,
      cupoMaximo: this.cupoAuto,
    };

    this.paralelosService.guardarParalelo(payload).subscribe({
      next: (paralelo) => {
        this.mensaje = 'Paralelo creado. Ahora asigna un docente a cada materia.';
        this.alCambiarNivel();
        this.paraleloGestionId = paralelo.id;
        this.cargarAsignaciones();
      },
      error: (e: any) => (this.error = e?.error?.message ?? 'No se pudo crear el paralelo.')
    });
  }

  cargarAsignaciones(): void {
    this.asignaturasParalelo = [];
    if (!this.paraleloGestionId) return;
    this.estructuraService.listarAsignaturaParalelo(this.paraleloGestionId).subscribe({
      next: (asignaciones: any[]) => (this.asignaturasParalelo = asignaciones),
      error: () => (this.asignaturasParalelo = []),
    });
  }

  estaAsignada(detalleId: string): boolean {
    return this.asignaturasParalelo.some((item) => item.detalleMalla?.id === detalleId);
  }

  get faltanAsignar(): number {
    return this.detallesNivel.filter((detalle) => !this.estaAsignada(detalle.id)).length;
  }

  get configuracionCompleta(): boolean {
    return !!this.paraleloGestionId && this.detallesNivel.length > 0 && this.faltanAsignar === 0;
  }

  asignarDocente(detalle: any): void {
    const docenteId = this.docentePorDetalle[detalle.id];
    if (!this.paraleloGestionId || !docenteId) {
      this.error = 'Selecciona un docente para la materia.';
      return;
    }
    this.estructuraService.agregarAsignaturaAParalelo({
      paraleloId: this.paraleloGestionId,
      detalleMallaId: detalle.id,
      docenteId,
    }).subscribe({
      next: () => {
        this.mensaje = 'Materia y docente asignados correctamente.';
        this.cargarAsignaciones();
      },
      error: (e: any) => (this.error = e?.error?.message ?? 'No se pudo asignar la materia.'),
    });
  }

  quitarAsignacion(asignacion: any): void {
    if (!confirm('¿Quitar esta materia del paralelo?')) return;
    this.estructuraService.quitarAsignaturaDeParalelo(asignacion.id).subscribe({
      next: () => this.cargarAsignaciones(),
      error: (e: any) => (this.error = e?.error?.message ?? 'No se pudo quitar la asignación.'),
    });
  }
}
