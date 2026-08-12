import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';
import { RouterModule } from '@angular/router';

type TabCatalogo = 'carreras' | 'asignaturas' | 'docentes' | 'mallas';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogos.html',
  styleUrl: './catalogos.scss',
})
export class Catalogos implements OnInit {
  private service = inject(EstructuraAcademicaService);

  tab: TabCatalogo = 'carreras';

  // ---------- CARRERAS ----------
  carreras: any[] = [];
  nuevaCarrera = { nombre: '', codigo: '' };
  editandoCarreraId = '';
  carreraEdit: any = {};

  // ---------- ASIGNATURAS ----------
  asignaturas: any[] = [];
  nuevaAsignatura = { codigo: '', nombre: '', horasSemanales: 0 };
  editandoAsignaturaId = '';
  asignaturaEdit: any = {};

  // ---------- DOCENTES ----------
  docentes: any[] = [];
  nuevoDocente = { nombres: '', apellidos: '', cedula: '', correo: '' };
  editandoDocenteId = '';
  docenteEdit: any = {};

  // ---------- MALLAS (drill-down interno) ----------
  carreraSeleccionadaId = '';
  versionesMalla: any[] = [];
  nuevaMalla = { nombre: '', version: '', fechaVigenciaInicio: '', estado: 'PROXIMA' };
  editandoMallaId = '';
  mallaEdit: any = {};

  mallaSeleccionadaId = '';
  niveles: any[] = [];
  nuevoNivel = { numero: 1, nombre: '' };
  editandoNivelId = '';
  nivelEdit: any = {};

  nivelSeleccionadoId = '';
  detalleMalla: any[] = [];
  asignaturaParaNivelId = '';

  ngOnInit(): void {
    this.cargarCarreras();
    this.cargarAsignaturas();
    this.cargarDocentes();
  }

  cambiarTab(t: TabCatalogo) {
    this.tab = t;
  }

  // ================= CARRERAS =================
  cargarCarreras() {
    this.service.listarCarreras().subscribe({ next: (d) => (this.carreras = d), error: (e) => console.error(e) });
  }

  crearCarrera() {
    if (!this.nuevaCarrera.nombre || !this.nuevaCarrera.codigo) {
      alert('Completa nombre y código.');
      return;
    }
    this.service.crearCarrera(this.nuevaCarrera).subscribe({
      next: () => { this.nuevaCarrera = { nombre: '', codigo: '' }; this.cargarCarreras(); },
      error: (e) => alert(e.error?.message || 'Error al crear carrera'),
    });
  }

  activarEdicionCarrera(c: any) {
    this.editandoCarreraId = c.id;
    this.carreraEdit = { nombre: c.nombre, codigo: c.codigo, estado: c.estado };
  }

  guardarEdicionCarrera(id: string) {
    this.service.editarCarrera(id, this.carreraEdit).subscribe({
      next: () => { this.editandoCarreraId = ''; this.cargarCarreras(); },
      error: (e) => alert(e.error?.message || 'Error al actualizar carrera'),
    });
  }

  eliminarCarrera(c: any) {
    if (!confirm(`¿Eliminar la carrera "${c.nombre}"?`)) return;
    this.service.eliminarCarrera(c.id).subscribe({
      next: () => this.cargarCarreras(),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar (probablemente tiene mallas asociadas).'),
    });
  }

  // ================= ASIGNATURAS =================
  cargarAsignaturas() {
    this.service.listarAsignaturasCatalogo().subscribe({ next: (d) => (this.asignaturas = d), error: (e) => console.error(e) });
  }

  crearAsignatura() {
    if (!this.nuevaAsignatura.codigo || !this.nuevaAsignatura.nombre) {
      alert('Completa código y nombre.');
      return;
    }
    this.service.crearAsignaturaCatalogo(this.nuevaAsignatura).subscribe({
      next: () => { this.nuevaAsignatura = { codigo: '', nombre: '', horasSemanales: 0 }; this.cargarAsignaturas(); },
      error: (e) => alert(e.error?.message || 'Error al crear asignatura'),
    });
  }

  activarEdicionAsignatura(a: any) {
    this.editandoAsignaturaId = a.id;
    this.asignaturaEdit = { codigo: a.codigo, nombre: a.nombre, horasSemanales: a.horasSemanales, estado: a.estado };
  }

  guardarEdicionAsignatura(id: string) {
    this.service.editarAsignaturaCatalogo(id, this.asignaturaEdit).subscribe({
      next: () => { this.editandoAsignaturaId = ''; this.cargarAsignaturas(); },
      error: (e) => alert(e.error?.message || 'Error al actualizar asignatura'),
    });
  }

  eliminarAsignatura(a: any) {
    if (!confirm(`¿Eliminar la asignatura "${a.nombre}"?`)) return;
    this.service.eliminarAsignaturaCatalogo(a.id).subscribe({
      next: () => this.cargarAsignaturas(),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar (probablemente está en uso en alguna malla).'),
    });
  }

  // ================= DOCENTES =================
  cargarDocentes() {
    this.service.listarDocentes().subscribe({ next: (d) => (this.docentes = d), error: (e) => console.error(e) });
  }

  crearDocente() {
    if (!this.nuevoDocente.nombres || !this.nuevoDocente.apellidos || !this.nuevoDocente.cedula) {
      alert('Completa nombres, apellidos y cédula.');
      return;
    }
    this.service.crearDocente(this.nuevoDocente).subscribe({
      next: () => { this.nuevoDocente = { nombres: '', apellidos: '', cedula: '', correo: '' }; this.cargarDocentes(); },
      error: (e) => alert(e.error?.message || 'Error al crear docente'),
    });
  }

  activarEdicionDocente(d: any) {
    this.editandoDocenteId = d.id;
    this.docenteEdit = { nombres: d.nombres, apellidos: d.apellidos, cedula: d.cedula, correo: d.correo, estado: d.estado };
  }

  guardarEdicionDocente(id: string) {
    this.service.editarDocente(id, this.docenteEdit).subscribe({
      next: () => { this.editandoDocenteId = ''; this.cargarDocentes(); },
      error: (e) => alert(e.error?.message || 'Error al actualizar docente'),
    });
  }

  eliminarDocente(d: any) {
    if (!confirm(`¿Eliminar al docente "${d.nombres} ${d.apellidos}"?`)) return;
    this.service.eliminarDocente(d.id).subscribe({
      next: () => this.cargarDocentes(),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar (probablemente tiene aulas asignadas).'),
    });
  }

  // ================= MALLAS =================
  onCarreraSeleccionada() {
    this.mallaSeleccionadaId = '';
    this.niveles = [];
    if (!this.carreraSeleccionadaId) { this.versionesMalla = []; return; }
    this.service.listarVersionesMalla(this.carreraSeleccionadaId).subscribe({
      next: (d) => (this.versionesMalla = d),
      error: (e) => console.error(e),
    });
  }

  crearMalla() {
    if (!this.carreraSeleccionadaId || !this.nuevaMalla.nombre || !this.nuevaMalla.version || !this.nuevaMalla.fechaVigenciaInicio) {
      alert('Completa todos los campos de la malla.');
      return;
    }
    this.service.crearVersionMalla({ ...this.nuevaMalla, carreraId: this.carreraSeleccionadaId }).subscribe({
      next: () => { this.nuevaMalla = { nombre: '', version: '', fechaVigenciaInicio: '', estado: 'PROXIMA' }; this.onCarreraSeleccionada(); },
      error: (e) => alert(e.error?.message || 'Error al crear malla'),
    });
  }

  activarEdicionMalla(m: any) {
    this.editandoMallaId = m.id;
    this.mallaEdit = { nombre: m.nombre, version: m.version, fechaVigenciaInicio: m.fechaVigenciaInicio };
  }

  guardarEdicionMalla(id: string) {
    this.service.editarVersionMalla(id, this.mallaEdit).subscribe({
      next: () => { this.editandoMallaId = ''; this.onCarreraSeleccionada(); },
      error: (e) => alert(e.error?.message || 'Error al actualizar la malla'),
    });
  }

  activarMalla(id: string) {
    if (!confirm('Esto marcará esta malla como ACTIVA y pasará la malla actualmente activa (si existe) a HISTORICA. ¿Continuar?')) return;
    this.service.activarVersionMalla(id).subscribe({
      next: () => this.onCarreraSeleccionada(),
      error: (e) => alert(e.error?.message || 'Error al activar malla'),
    });
  }

  eliminarMalla(m: any) {
    if (!confirm(`¿Eliminar "${m.nombre}"? Solo es posible si no tiene niveles definidos.`)) return;
    this.service.eliminarVersionMalla(m.id).subscribe({
      next: () => this.onCarreraSeleccionada(),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar la malla.'),
    });
  }

  onMallaSeleccionada() {
    this.nivelSeleccionadoId = '';
    this.detalleMalla = [];
    if (!this.mallaSeleccionadaId) { this.niveles = []; return; }
    this.service.listarNiveles(this.mallaSeleccionadaId).subscribe({
      next: (d) => (this.niveles = d),
      error: (e) => console.error(e),
    });
  }

  crearNivel() {
    if (!this.mallaSeleccionadaId || !this.nuevoNivel.numero) {
      alert('Selecciona una malla y el número de nivel.');
      return;
    }
    this.service.crearNivel({ ...this.nuevoNivel, versionMallaId: this.mallaSeleccionadaId }).subscribe({
      next: () => { this.nuevoNivel = { numero: 1, nombre: '' }; this.onMallaSeleccionada(); },
      error: (e) => alert(e.error?.message || 'Error al crear nivel'),
    });
  }

  activarEdicionNivel(n: any) {
    this.editandoNivelId = n.id;
    this.nivelEdit = { numero: n.numero, nombre: n.nombre };
  }

  guardarEdicionNivel(id: string) {
    this.service.editarNivel(id, this.nivelEdit).subscribe({
      next: () => { this.editandoNivelId = ''; this.onMallaSeleccionada(); },
      error: (e) => alert(e.error?.message || 'Error al actualizar nivel'),
    });
  }

  eliminarNivel(n: any) {
    if (!confirm(`¿Eliminar el Nivel ${n.numero}? Solo es posible si no tiene asignaturas asociadas.`)) return;
    this.service.eliminarNivel(n.id).subscribe({
      next: () => this.onMallaSeleccionada(),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar el nivel.'),
    });
  }

  seleccionarNivel(id: string) {
    this.nivelSeleccionadoId = id;
    this.service.listarDetalleMalla(id).subscribe({
      next: (d) => (this.detalleMalla = d),
      error: (e) => console.error(e),
    });
  }

  agregarAsignaturaANivel() {
    if (!this.nivelSeleccionadoId || !this.asignaturaParaNivelId) {
      alert('Selecciona nivel y asignatura.');
      return;
    }
    this.service.agregarAsignaturaANivel({ nivelId: this.nivelSeleccionadoId, asignaturaId: this.asignaturaParaNivelId }).subscribe({
      next: () => { this.asignaturaParaNivelId = ''; this.seleccionarNivel(this.nivelSeleccionadoId); },
      error: (e) => alert(e.error?.message || 'Error al agregar asignatura'),
    });
  }

  quitarAsignaturaDeNivel(detalleId: string) {
    if (!confirm('¿Quitar esta asignatura del nivel?')) return;
    this.service.quitarAsignaturaDeNivel(detalleId).subscribe({
      next: () => this.seleccionarNivel(this.nivelSeleccionadoId),
      error: (e) => alert(e.error?.message || 'Error al quitar la asignatura'),
    });
  }
}