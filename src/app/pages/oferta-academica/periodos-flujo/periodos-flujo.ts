import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstructuraAcademicaService } from '../../../core/service/estructura-academica.service';

@Component({ selector: 'app-periodos-flujo', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './periodos-flujo.html', styleUrl: './periodos-flujo.scss' })
export class PeriodosFlujo implements OnInit {
  private service = inject(EstructuraAcademicaService);
  periodos: any[] = [];
  nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' };
  editandoPeriodoId = '';
  periodoEdit: any = {};
  cargando = true;
  error = '';
  mensaje = '';

  ngOnInit(): void { this.cargarPeriodos(); }

  cargarPeriodos(): void {
    this.cargando = true;
    this.service.listarPeriodos().subscribe({
      next: (data: any[]) => { this.periodos = data; this.cargando = false; },
      error: (err) => { this.error = err.error?.message || 'No se pudieron cargar los periodos.'; this.cargando = false; },
    });
  }

  crearPeriodo(): void {
    this.error = ''; this.mensaje = '';
    if (!this.nuevoPeriodo.nombre.trim() || !this.nuevoPeriodo.fechaInicio || !this.nuevoPeriodo.fechaFin) { this.error = 'Completa nombre, fecha de inicio y fecha de fin.'; return; }
    if (this.nuevoPeriodo.fechaInicio >= this.nuevoPeriodo.fechaFin) { this.error = 'La fecha de fin debe ser posterior a la fecha de inicio.'; return; }
    this.service.crearPeriodo(this.nuevoPeriodo).subscribe({
      next: () => { this.nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' }; this.mensaje = 'Periodo creado. Podrás asociarle carreras cuando ambas ramas estén listas.'; this.cargarPeriodos(); },
      error: (err) => (this.error = err.error?.message || 'No se pudo crear el periodo.'),
    });
  }

  activarEdicionPeriodo(p: any): void {
    this.editandoPeriodoId = p.id;
    this.periodoEdit = { nombre: p.nombre, fechaInicio: p.fechaInicio, fechaFin: p.fechaFin, estado: p.estado };
  }

  guardarEdicionPeriodo(id: string): void {
    this.service.editarPeriodo(id, this.periodoEdit).subscribe({
      next: () => { this.editandoPeriodoId = ''; this.mensaje = 'Periodo actualizado correctamente.'; this.cargarPeriodos(); },
      error: (err) => (this.error = err.error?.message || 'No se pudo actualizar el periodo.'),
    });
  }

  eliminarPeriodo(p: any): void {
    if (!confirm(`¿Eliminar el periodo "${p.nombre}"?`)) return;
    this.service.eliminarPeriodo(p.id).subscribe({ next: () => this.cargarPeriodos(), error: (err) => (this.error = err.error?.message || 'No se puede eliminar porque tiene información relacionada.') });
  }
}
