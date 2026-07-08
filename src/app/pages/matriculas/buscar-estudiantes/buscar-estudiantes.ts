import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudiantesService } from '../estudiantes.service';

@Component({
  selector: 'app-buscar-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-estudiantes.html',
  styleUrl: './buscar-estudiantes.scss',
})
export class BuscarEstudiantes {
  private estudiantesService = inject(EstudiantesService);

  terminoBusqueda = '';
  todosLosEstudiantes: any[] = [];
  resultados: any[] = [];
  estudianteSeleccionado: any = null;
  modoEdicion = false;

  buscar() {
    // Traemos todos y filtramos en el front (el back aún no tiene endpoint de búsqueda)
    this.estudiantesService.obtenerEstudiantes().subscribe({
      next: (data: any[]) => {
        this.todosLosEstudiantes = data;
        const termino = this.terminoBusqueda.trim().toLowerCase();

        if (!termino) {
          this.resultados = [];
          return;
        }

        this.resultados = data.filter(est =>
          est.cedula?.toLowerCase().includes(termino) ||
          est.nombres?.toLowerCase().includes(termino) ||
          est.apellidos?.toLowerCase().includes(termino) ||
          est.correo?.toLowerCase().includes(termino)
        );

        this.estudianteSeleccionado = null;
        this.modoEdicion = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error al buscar estudiantes.');
      }
    });
  }

  seleccionar(estudiante: any) {
    // Clonamos para no editar la lista directamente hasta guardar
    this.estudianteSeleccionado = { ...estudiante };
    this.modoEdicion = false;
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  guardarActualizacion() {
    if (!this.estudianteSeleccionado?.id) {
      alert('No se pudo identificar el estudiante a actualizar.');
      return;
    }

    this.estudiantesService
      .actualizarEstudiante(this.estudianteSeleccionado.id, this.estudianteSeleccionado)
      .subscribe({
        next: () => {
          alert('Estudiante actualizado con éxito ✅');
          this.modoEdicion = false;
          this.buscar(); // refresca la lista de resultados
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el estudiante.');
        }
      });
  }

  anular() {
    if (!this.estudianteSeleccionado?.id) {
      alert('No se pudo identificar el estudiante a anular.');
      return;
    }

    const confirmar = confirm(
      `¿Seguro que deseas anular la matrícula de ${this.estudianteSeleccionado.nombres}?`
    );
    if (!confirmar) return;

    this.estudiantesService
      .actualizarEstudiante(this.estudianteSeleccionado.id, { estado: 'ANULADA' })
      .subscribe({
        next: () => {
          alert('Matrícula anulada ✅');
          this.estudianteSeleccionado.estado = 'ANULADA';
          this.buscar();
        },
        error: (err) => {
          console.error(err);
          alert('Error al anular la matrícula.');
        }
      });
  }
}