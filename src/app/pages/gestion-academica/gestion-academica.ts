import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicoService } from '../../core/service/academico.service';
import { EstudiantesService } from '../matriculas/estudiantes.service';

@Component({
  selector: 'app-gestion-academica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-academica.html',
  styleUrl: './gestion-academica.scss',
})
export class GestionAcademica implements OnInit {
  private academicoService = inject(AcademicoService);
  private estudiantesService = inject(EstudiantesService);

  asignaturas: any[] = [];
  nuevaAsignatura = { nombre: '', carrera: 'Sistemas', periodo: 'Primero' };

  estudiantes: any[] = [];
  estudianteSeleccionadoId = '';
  estudianteSeleccionado: any = null; // guardamos el objeto completo, no solo el id
  asignaturasFiltradas: any[] = [];   // solo las que corresponden a su carrera/periodo
  historialDelEstudiante: any[] = [];

  nuevaNota = { asignaturaId: '', nota: 0 };

  ngOnInit(): void {
    this.cargarAsignaturas();
    this.cargarEstudiantes();
  }

  cargarAsignaturas() {
    this.academicoService.listarAsignaturas().subscribe({
      next: (data: any) => this.asignaturas = data,
      error: (err: any) => console.error(err)
    });
  }

  cargarEstudiantes() {
    this.estudiantesService.obtenerEstudiantes().subscribe({
      next: (data: any) => this.estudiantes = data,
      error: (err: any) => console.error(err)
    });
  }

  crearAsignatura() {
    if (!this.nuevaAsignatura.nombre) {
      alert('Escribe el nombre de la asignatura.');
      return;
    }
    this.academicoService.crearAsignatura(this.nuevaAsignatura).subscribe({
      next: () => {
        alert('Asignatura creada ✅');
        this.nuevaAsignatura = { nombre: '', carrera: 'Sistemas', periodo: 'Primero' };
        this.cargarAsignaturas();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al crear la asignatura.');
      }
    });
  }

  seleccionarEstudiante() {
    if (!this.estudianteSeleccionadoId) {
      this.estudianteSeleccionado = null;
      this.asignaturasFiltradas = [];
      this.historialDelEstudiante = [];
      return;
    }

    // Buscamos el objeto completo del estudiante para conocer su carrera/periodo
    this.estudianteSeleccionado = this.estudiantes.find(e => e.id === this.estudianteSeleccionadoId);

    // Filtramos las asignaturas: solo las que coinciden con su carrera Y su periodo actual
    this.asignaturasFiltradas = this.asignaturas.filter(a =>
      a.carrera === this.estudianteSeleccionado?.carrera &&
      a.periodo === this.estudianteSeleccionado?.periodo
    );

    this.nuevaNota = { asignaturaId: '', nota: 0 }; // reseteamos por si quedó una asignatura de otro estudiante seleccionada

    this.academicoService.historialPorEstudiante(this.estudianteSeleccionadoId).subscribe({
      next: (data: any) => this.historialDelEstudiante = data,
      error: (err: any) => console.error(err)
    });
  }

  registrarNota() {
    if (!this.estudianteSeleccionadoId || !this.nuevaNota.asignaturaId) {
      alert('Selecciona un estudiante y una asignatura.');
      return;
    }

    this.academicoService.registrarNota({
      estudianteId: this.estudianteSeleccionadoId,
      asignaturaId: this.nuevaNota.asignaturaId,
      nota: this.nuevaNota.nota
    }).subscribe({
      next: () => {
        alert('Nota registrada ✅');
        this.nuevaNota = { asignaturaId: '', nota: 0 };
        this.seleccionarEstudiante();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al registrar la nota.');
      }
    });
  }
}