import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EstructuraAcademicaService } from '../../../core/service/estructura-academica.service';

@Component({
  selector: 'app-carreras-periodo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carreras-periodo.html',
  styleUrl: './carreras-periodo.scss',
})
export class CarrerasPeriodo implements OnInit {
  private service = inject(EstructuraAcademicaService);
  periodos: any[] = [];
  carreras: any[] = [];
  centros: any[] = [];
  ofertas: any[] = [];
  mallasCarrera: any[] = [];
  mallaActiva: any = null;
  periodoId = '';
  carreraId = '';
  centroEstudioId = '';
  jornada = '';
  filtroPeriodoId = '';
  cargando = true;
  guardando = false;
  error = '';
  mensaje = '';

  ngOnInit(): void { this.cargarTodo(); }

  cargarTodo(): void {
    this.cargando = true;
    forkJoin({
      periodos: this.service.listarPeriodos(),
      carreras: this.service.listarCarreras(),
      centros: this.service.listarCentrosEstudio(),
      ofertas: this.service.listarPeriodoCarrera(),
    }).subscribe({
      next: ({ periodos, carreras, centros, ofertas }: any) => {
        this.periodos = periodos.filter((p: any) => p.estado !== 'CERRADO');
        this.carreras = carreras.filter((c: any) => c.estado === 'ACTIVA');
        this.centros = centros.filter((c: any) => c.estado === 'ACTIVO');
        this.ofertas = ofertas;
        this.cargando = false;
      },
      error: (err) => { this.error = err.error?.message || 'No se pudo cargar la parametrización.'; this.cargando = false; },
    });
  }

  cambiarCarrera(): void {
    this.mallaActiva = null;
    this.mallasCarrera = [];
    if (!this.carreraId) return;
    this.service.listarVersionesMalla(this.carreraId).subscribe({
      next: (mallas: any[]) => {
        this.mallasCarrera = mallas;
        this.mallaActiva = mallas.find((malla) => malla.estado === 'ACTIVA') ?? null;
      },
      error: () => (this.error = 'No se pudieron consultar las mallas de la carrera.'),
    });
  }

  guardar(): void {
    this.error = ''; this.mensaje = '';
    if (!this.periodoId || !this.carreraId || !this.centroEstudioId || !this.jornada) { this.error = 'Selecciona periodo, carrera, centro y jornada.'; return; }
    if (!this.mallaActiva) { this.error = 'La carrera no tiene una malla ACTIVA. Regresa a Carreras y mallas, completa sus niveles y actívala.'; return; }
    this.guardando = true;
    this.service.crearPeriodoCarrera({ periodoId: this.periodoId, carreraId: this.carreraId, centroEstudioId: this.centroEstudioId, jornada: this.jornada }).subscribe({
      next: () => {
        this.guardando = false; this.mensaje = 'Carrera asociada al periodo. La malla activa, sus niveles y asignaturas fueron heredados.';
        this.jornada = ''; this.centroEstudioId = ''; this.cargarTodo();
      },
      error: (err) => { this.guardando = false; this.error = err.error?.message || 'No se pudo crear la asociación.'; },
    });
  }

  get ofertasFiltradas(): any[] {
    return this.filtroPeriodoId ? this.ofertas.filter((o) => o.periodo?.id === this.filtroPeriodoId) : this.ofertas;
  }

  desactivar(oferta: any): void {
    if (!confirm(`¿Desactivar ${oferta.carrera?.nombre} · ${oferta.jornada} del periodo ${oferta.periodo?.nombre}?`)) return;
    this.service.desactivarPeriodoCarrera(oferta.id).subscribe({ next: () => this.cargarTodo(), error: (err) => (this.error = err.error?.message || 'No se pudo desactivar la oferta.') });
  }
}
