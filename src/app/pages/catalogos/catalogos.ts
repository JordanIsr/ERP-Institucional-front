import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';

type TabCatalogo = 'carreras' | 'asignaturas' | 'docentes';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      error: (e) => alert(e.error?.message || 'No se pudo eliminar la carrera.'),
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
      error: (e) => alert(e.error?.message || 'No se pudo eliminar la asignatura.'),
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
      error: (e) => alert(e.error?.message || 'No se pudo eliminar al docente.'),
    });
  }
}