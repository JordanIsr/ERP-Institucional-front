import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../../core/service/estructura-academica.service';

@Component({
  selector: 'app-periodos-flujo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodos-flujo.html',
  styleUrl: './periodos-flujo.scss'
})
export class PeriodosFlujo implements OnInit {
  private service = inject(EstructuraAcademicaService);

  periodos: any[] = [];
  nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' };
  editandoPeriodoId = '';
  periodoEdit: any = {};

  // Propiedades agregadas para la habilitación
carreras: any[] = [];
  mallasDisponibles: any[] = [];
  centrosEstudio: any[] = [];
  periodoSeleccionadoHabilitar: any = null;
  carreraIdSeleccionada = '';
  mallaIdSeleccionada = '';
  centroEstudioIdSeleccionado = '';
  jornadaSeleccionada = '';
  cargandoMallas = false;

  ngOnInit(): void {
    this.cargarPeriodos();
    this.cargarCarreras();
    this.cargarCentrosEstudio();
  }

  cargarCentrosEstudio(): void {
    this.service.listarCentrosEstudio().subscribe({
      next: (data: any) => (this.centrosEstudio = data),
      error: (err: any) => console.error(err),
    });
  }

  cargarPeriodos(): void {
    this.service.listarPeriodos().subscribe({
      next: (data: any) => (this.periodos = data),
      error: (err: any) => console.error(err),
    });
  }

  cargarCarreras(): void {
    this.service.listarCarreras().subscribe({
      next: (data: any) => (this.carreras = data),
      error: (err: any) => console.error(err),
    });
  }

  crearPeriodo(): void {
    if (!this.nuevoPeriodo.nombre || !this.nuevoPeriodo.fechaInicio || !this.nuevoPeriodo.fechaFin) {
      alert('Completa nombre, fecha de inicio y fecha de fin.');
      return;
    }
    this.service.crearPeriodo(this.nuevoPeriodo).subscribe({
      next: () => {
        this.nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' };
        this.cargarPeriodos();
      },
      error: (err: any) => alert(err.error?.message || 'Error al crear el periodo.'),
    });
  }

  // --- MÉTODOS DE HABILITACIÓN DE CARRERA EN PERIODO ---
abrirHabilitarCarrera(periodo: any): void {
    this.periodoSeleccionadoHabilitar = periodo;
    this.carreraIdSeleccionada = '';
    this.mallaIdSeleccionada = '';
    this.centroEstudioIdSeleccionado = '';
    this.jornadaSeleccionada = '';
    this.mallasDisponibles = [];
  }

  // Reemplaza el método en periodos-flujo.ts
onCarreraChange(): void {
  if (!this.carreraIdSeleccionada) {
    this.mallasDisponibles = [];
    return;
  }
  this.cargandoMallas = true;

  // Usa directamente el método definido en tu EstructuraAcademicaService
  this.service.listarVersionesMalla(this.carreraIdSeleccionada).subscribe({
    next: (mallas: any) => {
      this.mallasDisponibles = mallas.filter((malla: any) => malla.estado !== 'PROXIMA');
      this.cargandoMallas = false;
    },
    error: (err: any) => {
      console.error('Error al cargar mallas:', err);
      this.cargandoMallas = false;
    }
  });
  }

  guardarHabilitacion(): void {
    if (!this.carreraIdSeleccionada || !this.mallaIdSeleccionada || !this.centroEstudioIdSeleccionado || !this.jornadaSeleccionada) {
      alert('Selecciona carrera, malla, centro de estudio y jornada.');
      return;
    }

    const payload = {
      periodoId: this.periodoSeleccionadoHabilitar.id,
      carreraId: this.carreraIdSeleccionada,
      versionMallaId: this.mallaIdSeleccionada,
      centroEstudioId: this.centroEstudioIdSeleccionado,
      jornada: this.jornadaSeleccionada,
    };

    this.service.crearPeriodoCarrera(payload).subscribe({
      next: () => {
        alert('¡Carrera habilitada exitosamente en este periodo!');
        this.periodoSeleccionadoHabilitar = null;
        this.cargarPeriodos();
      },
      error: (err: any) => alert(err.error?.message || 'Error al habilitar la carrera en el periodo.')
    });
  }

  cerrarHabilitacion(): void {
    this.periodoSeleccionadoHabilitar = null;
  }
  // ----------------------------------------------------

  activarEdicionPeriodo(p: any): void {
    this.editandoPeriodoId = p.id;
    this.periodoEdit = { nombre: p.nombre, fechaInicio: p.fechaInicio, fechaFin: p.fechaFin, estado: p.estado };
  }

  cancelarEdicionPeriodo(): void {
    this.editandoPeriodoId = '';
  }

  guardarEdicionPeriodo(id: string): void {
    this.service.editarPeriodo(id, this.periodoEdit).subscribe({
      next: () => {
        this.editandoPeriodoId = '';
        this.cargarPeriodos();
      },
      error: (err: any) => alert(err.error?.message || 'Error al actualizar el periodo.'),
    });
  }

  eliminarPeriodo(p: any): void {
    if (!confirm(`¿Eliminar el periodo "${p.nombre}"?`)) return;
    this.service.eliminarPeriodo(p.id).subscribe({
      next: () => this.cargarPeriodos(),
      error: (err: any) => alert(err.error?.message || 'No se pudo eliminar el periodo.'),
    });
  }
}
