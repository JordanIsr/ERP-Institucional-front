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
      error: (err) => { this.error = this.mensajeError(err, 'No se pudieron cargar los periodos.'); this.cargando = false; },
    });
  }

  crearPeriodo(): void {
    this.error = ''; this.mensaje = '';
    this.nuevoPeriodo.nombre = this.nuevoPeriodo.nombre.trim().toUpperCase();
    if (!this.nuevoPeriodo.nombre.trim()) { this.error = 'El periodo académico es obligatorio.'; return; }
    if (!this.nuevoPeriodo.fechaInicio) { this.error = 'La fecha de inicio del periodo es obligatoria.'; return; }
    if (!this.nuevoPeriodo.fechaFin) { this.error = 'La fecha de fin del periodo es obligatoria.'; return; }
    if (!/^\d{4}-(I|II)$/.test(this.nuevoPeriodo.nombre)) { this.error = 'El periodo debe tener exactamente el formato AAAA-I o AAAA-II.'; return; }
    if (Number(this.nuevoPeriodo.nombre.slice(0, 4)) < 2000 || Number(this.nuevoPeriodo.nombre.slice(0, 4)) > 2100) { this.error = 'El año del periodo debe estar entre 2000 y 2100.'; return; }
    const errorFechas = this.validarFechasPeriodo(this.nuevoPeriodo);
    if (errorFechas) { this.error = errorFechas; return; }
    this.service.crearPeriodo(this.nuevoPeriodo).subscribe({
      next: () => { this.nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' }; this.mensaje = 'Periodo creado. Podrás asociarle carreras cuando ambas ramas estén listas.'; this.cargarPeriodos(); },
      error: (err) => (this.error = this.mensajeError(err, 'No se pudo crear el periodo.')),
    });
  }

  activarEdicionPeriodo(p: any): void {
    this.editandoPeriodoId = p.id;
    this.periodoEdit = { nombre: p.nombre, fechaInicio: p.fechaInicio, fechaFin: p.fechaFin, estado: p.estado };
  }

  guardarEdicionPeriodo(id: string): void {
    this.periodoEdit.nombre = String(this.periodoEdit.nombre).trim().toUpperCase();
    if (!this.periodoEdit.nombre) { this.error = 'El periodo académico es obligatorio.'; return; }
    if (!this.periodoEdit.fechaInicio) { this.error = 'La fecha de inicio del periodo es obligatoria.'; return; }
    if (!this.periodoEdit.fechaFin) { this.error = 'La fecha de fin del periodo es obligatoria.'; return; }
    if (!/^\d{4}-(I|II)$/.test(this.periodoEdit.nombre)) { this.error = 'El periodo debe tener exactamente el formato AAAA-I o AAAA-II.'; return; }
    if (Number(this.periodoEdit.nombre.slice(0, 4)) < 2000 || Number(this.periodoEdit.nombre.slice(0, 4)) > 2100) { this.error = 'El año del periodo debe estar entre 2000 y 2100.'; return; }
    const errorFechas = this.validarFechasPeriodo(this.periodoEdit);
    if (errorFechas) { this.error = errorFechas; return; }
    this.service.editarPeriodo(id, this.periodoEdit).subscribe({
      next: () => { this.editandoPeriodoId = ''; this.mensaje = 'Periodo actualizado correctamente.'; this.cargarPeriodos(); },
      error: (err) => (this.error = this.mensajeError(err, 'No se pudo actualizar el periodo.')),
    });
  }

  eliminarPeriodo(p: any): void {
    if (!confirm(`¿Eliminar el periodo "${p.nombre}"?`)) return;
    this.service.eliminarPeriodo(p.id).subscribe({ next: () => this.cargarPeriodos(), error: (err) => (this.error = this.mensajeError(err, 'No se puede eliminar porque tiene información relacionada.')) });
  }

  private validarFechasPeriodo(periodo: { nombre: string; fechaInicio: string; fechaFin: string }): string {
    if (periodo.fechaInicio >= periodo.fechaFin) return 'La fecha de fin debe ser posterior a la fecha de inicio.';
    const anio = Number(periodo.nombre.slice(0, 4));
    const inicio = new Date(`${periodo.fechaInicio}T00:00:00Z`);
    const fin = new Date(`${periodo.fechaFin}T00:00:00Z`);
    const semestre = periodo.nombre.endsWith('-I') ? 'I' : 'II';
    const mesInicio = inicio.getUTCMonth() + 1;
    if (inicio.getUTCFullYear() !== anio) return `La fecha de inicio debe pertenecer al año ${anio}.`;
    if (semestre === 'I' && mesInicio > 6) return `El periodo ${periodo.nombre} debe iniciar entre enero y junio de ${anio}.`;
    if (semestre === 'II' && mesInicio < 7) return `El periodo ${periodo.nombre} debe iniciar entre julio y diciembre de ${anio}.`;
    if (semestre === 'I' && fin.getUTCFullYear() !== anio) return `El periodo ${periodo.nombre} debe finalizar dentro del año ${anio}.`;
    if (semestre === 'II') {
      const finValido = fin.getUTCFullYear() === anio || (fin.getUTCFullYear() === anio + 1 && fin.getUTCMonth() + 1 <= 6);
      if (!finValido) return `El periodo ${periodo.nombre} debe finalizar hasta junio de ${anio + 1}.`;
    }
    return '';
  }

  private mensajeError(error: any, predeterminado: string): string {
    const mensaje = error?.error?.message;
    return Array.isArray(mensaje) ? mensaje.join(' ') : mensaje ?? predeterminado;
  }
}
