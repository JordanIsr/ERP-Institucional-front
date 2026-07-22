import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';

type Vista = 'periodos' | 'carreras' | 'paralelos' | 'aula';

@Component({
  selector: 'app-periodos-flujo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodos-flujo.html',
  styleUrl: './periodos-flujo.scss'
})
export class PeriodosFlujo implements OnInit {
  private service = inject(EstructuraAcademicaService);

  vista: Vista = 'periodos';

  // ---------- PERIODOS ----------
  periodos: any[] = [];
  nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' };
  editandoPeriodoId = '';
  periodoEdit: any = {};

  periodoSeleccionado: any = null;

  // ---------- CARRERAS HABILITADAS (PeriodoCarrera) ----------
  periodoCarreraLista: any[] = [];
  carrerasCatalogo: any[] = [];
  mallasActivasDeCarrera: any[] = [];
  nuevoPC = { carreraId: '', versionMallaId: '', jornada: 'MATUTINA' };

  pcSeleccionado: any = null;

  // ---------- PARALELOS ----------
  paralelos: any[] = [];
  nivelesDeLaMalla: any[] = [];
  nuevoParalelo = { nivelId: '', nombre: '', cupoMaximo: 30 };

  paraleloSeleccionado: any = null;

  // ---------- AULA (asignaturas + docente del paralelo) ----------
  detalleMallaDelNivel: any[] = [];
  asignaturasParalelo: any[] = [];
  docentes: any[] = [];
  nuevoAP = { detalleMallaId: '', docenteId: '' };

  ngOnInit(): void {
    this.cargarPeriodos();
    this.cargarCarrerasCatalogo();
    this.cargarDocentes();
  }

  // ================= PERIODOS =================
  cargarPeriodos() {
    this.service.listarPeriodos().subscribe({
      next: (data) => (this.periodos = data),
      error: (err) => console.error(err),
    });
  }

  crearPeriodo() {
    if (!this.nuevoPeriodo.nombre || !this.nuevoPeriodo.fechaInicio || !this.nuevoPeriodo.fechaFin) {
      alert('Completa nombre, fecha de inicio y fecha de fin del periodo.');
      return;
    }
    this.service.crearPeriodo(this.nuevoPeriodo).subscribe({
      next: () => {
        this.nuevoPeriodo = { nombre: '', fechaInicio: '', fechaFin: '' };
        this.cargarPeriodos();
      },
      error: (err) => alert(err.error?.message || 'Error al crear el periodo.'),
    });
  }

  activarEdicionPeriodo(p: any) {
    this.editandoPeriodoId = p.id;
    this.periodoEdit = { nombre: p.nombre, fechaInicio: p.fechaInicio, fechaFin: p.fechaFin, estado: p.estado };
  }

  cancelarEdicionPeriodo() {
    this.editandoPeriodoId = '';
  }

  guardarEdicionPeriodo(id: string) {
    this.service.editarPeriodo(id, this.periodoEdit).subscribe({
      next: () => {
        this.editandoPeriodoId = '';
        this.cargarPeriodos();
      },
      error: (err) => alert(err.error?.message || 'Error al actualizar el periodo.'),
    });
  }

  eliminarPeriodo(p: any) {
    const confirmar = confirm(`¿Eliminar el periodo "${p.nombre}"? Esto solo es posible si no tiene carreras habilitadas.`);
    if (!confirmar) return;
    this.service.eliminarPeriodo(p.id).subscribe({
      next: () => this.cargarPeriodos(),
      error: (err) => alert(err.error?.message || 'No se pudo eliminar el periodo.'),
    });
  }

  abrirPeriodo(p: any) {
    this.periodoSeleccionado = p;
    this.vista = 'carreras';
    this.cargarPeriodoCarrera();
  }

  // ================= CARRERAS HABILITADAS =================
  cargarCarrerasCatalogo() {
    this.service.listarCarreras().subscribe({
      next: (data) => (this.carrerasCatalogo = data),
      error: (err) => console.error(err),
    });
  }

  cargarPeriodoCarrera() {
    if (!this.periodoSeleccionado) return;
    this.service.listarPeriodoCarrera({ periodoId: this.periodoSeleccionado.id }).subscribe({
      next: (data) => (this.periodoCarreraLista = data),
      error: (err) => console.error(err),
    });
  }

  onSeleccionCarreraParaHabilitar() {
    this.nuevoPC.versionMallaId = '';
    if (!this.nuevoPC.carreraId) {
      this.mallasActivasDeCarrera = [];
      return;
    }
    this.service.listarVersionesMalla(this.nuevoPC.carreraId).subscribe({
      next: (data) => (this.mallasActivasDeCarrera = data.filter((m: any) => m.estado === 'ACTIVA')),
      error: (err) => console.error(err),
    });
  }

  habilitarCarrera() {
    if (!this.nuevoPC.carreraId || !this.nuevoPC.versionMallaId) {
      alert('Selecciona una carrera y su malla activa.');
      return;
    }
    this.service
      .crearPeriodoCarrera({ ...this.nuevoPC, periodoId: this.periodoSeleccionado.id })
      .subscribe({
        next: () => {
          this.nuevoPC = { carreraId: '', versionMallaId: '', jornada: 'MATUTINA' };
          this.mallasActivasDeCarrera = [];
          this.cargarPeriodoCarrera();
        },
        error: (err) => alert(err.error?.message || 'Error al habilitar la carrera.'),
      });
  }

  abrirCarreraHabilitada(pc: any) {
    this.pcSeleccionado = pc;
    this.vista = 'paralelos';
    this.cargarParalelos();
    this.service.listarNiveles(pc.versionMalla.id).subscribe({
      next: (data) => (this.nivelesDeLaMalla = data),
      error: (err) => console.error(err),
    });
  }

  // ================= PARALELOS (AULAS) =================
  cargarParalelos() {
    if (!this.pcSeleccionado) return;
    this.service.listarParalelos(this.pcSeleccionado.id).subscribe({
      next: (data) => (this.paralelos = data),
      error: (err) => console.error(err),
    });
  }

  crearParalelo() {
    if (!this.nuevoParalelo.nivelId || !this.nuevoParalelo.nombre) {
      alert('Selecciona el nivel y escribe el nombre del aula (ej. A, B).');
      return;
    }
    this.service
      .crearParalelo({ ...this.nuevoParalelo, periodoCarreraId: this.pcSeleccionado.id })
      .subscribe({
        next: () => {
          this.nuevoParalelo = { nivelId: '', nombre: '', cupoMaximo: 30 };
          this.cargarParalelos();
        },
        error: (err) => alert(err.error?.message || 'Error al crear el aula.'),
      });
  }

  abrirParalelo(p: any) {
    this.paraleloSeleccionado = p;
    this.vista = 'aula';
    this.service.listarAsignaturaParalelo(p.id).subscribe({
      next: (data) => (this.asignaturasParalelo = data),
      error: (err) => console.error(err),
    });
    this.service.listarDetalleMalla(p.nivel.id).subscribe({
      next: (data) => (this.detalleMallaDelNivel = data),
      error: (err) => console.error(err),
    });
  }

  // ================= DOCENTES (para el select) =================
  cargarDocentes() {
    this.service.listarDocentes().subscribe({
      next: (data) => (this.docentes = data),
      error: (err) => console.error(err),
    });
  }

  agregarAsignaturaAParalelo() {
    if (!this.nuevoAP.detalleMallaId || !this.nuevoAP.docenteId) {
      alert('Selecciona la asignatura y el docente.');
      return;
    }
    this.service
      .agregarAsignaturaAParalelo({ ...this.nuevoAP, paraleloId: this.paraleloSeleccionado.id })
      .subscribe({
        next: () => {
          this.nuevoAP = { detalleMallaId: '', docenteId: '' };
          this.service.listarAsignaturaParalelo(this.paraleloSeleccionado.id).subscribe({
            next: (data) => (this.asignaturasParalelo = data),
          });
        },
        error: (err) => alert(err.error?.message || 'Error al asignar la asignatura.'),
      });
  }

  // ================= NAVEGACIÓN (BREADCRUMB) =================
  irAPeriodos() {
    this.vista = 'periodos';
    this.periodoSeleccionado = null;
    this.pcSeleccionado = null;
    this.paraleloSeleccionado = null;
  }

  irACarreras() {
    this.vista = 'carreras';
    this.pcSeleccionado = null;
    this.paraleloSeleccionado = null;
  }

  irAParalelos() {
    this.vista = 'paralelos';
    this.paraleloSeleccionado = null;
  }
}