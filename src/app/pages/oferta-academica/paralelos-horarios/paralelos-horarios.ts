import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../../core/service/estructura-academica.service';
import { ParalelosService, Aula, ParaleloPayload } from '../../../core/service/paralelos.service';

@Component({
  selector: 'app-paralelos-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.estructuraService.listarPeriodoCarrera().subscribe({
        next: (res: any) => (this.periodosCarrera = res),
        error: (e: any) => console.error(e)
    });

    this.estructuraService.listarDocentes().subscribe({
      next: (res: any[]) => (this.docentes = res.filter((docente) => docente.estado === 'ACTIVO')),
      error: (e: any) => console.error(e),
    });

    this.paralelosService.listarAulas().subscribe({
      next: (res) => (this.aulas = res),
      error: (e: any) => console.error(e)
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
        next: (niveles: any) => (this.nivelesMalla = niveles),
        error: () => (this.nivelesMalla = [])
      });
    }
    this.nivelId = '';
    this.paralelos = [];
    this.detallesNivel = [];
    this.paraleloGestionId = '';
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
      next: (detalles: any[]) => (this.detallesNivel = detalles),
      error: () => (this.detallesNivel = []),
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
