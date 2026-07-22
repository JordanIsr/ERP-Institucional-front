import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudiantesService } from '../estudiantes.service';
import { AcademicoService } from '../../../core/service/academico.service';

@Component({
  selector: 'app-buscar-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-estudiantes.html',
  styleUrl: './buscar-estudiantes.scss',
})
export class BuscarEstudiantes {

  private academicoService = inject(AcademicoService);
  private estudiantesService = inject(EstudiantesService);

  bloqueoMatricula = false;
  mensajeBloqueo = '';
  archivoSeleccionado: File | null = null;
  subiendoComprobante = false;
  comprobanteSubido = false;

  terminoBusqueda = '';
  todosLosEstudiantes: any[] = [];
  resultados: any[] = [];
  estudianteSeleccionado: any = null;
  modoEdicion = false;

  buscar() {
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
    this.estudianteSeleccionado = { ...estudiante };
    this.modoEdicion = false;
    this.bloqueoMatricula = false;
    this.comprobanteSubido = false;
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  guardarActualizacion(): void {
    if (!this.estudianteSeleccionado?.id) {
      alert('No se pudo identificar el estudiante a actualizar.');
      return;
    }

    this.bloqueoMatricula = false;

    this.estudiantesService
      .actualizarEstudiante(this.estudianteSeleccionado.id, this.estudianteSeleccionado)
      .subscribe({
        next: (): void => {
          alert('Estudiante actualizado con éxito ✅');
          this.modoEdicion = false;
          this.bloqueoMatricula = false;
          this.buscar();
        },
        error: (err: any) => {
          console.error(err);

          const mensaje = err?.error?.message ?? '';
          if (err.status === 400 && mensaje.includes('reprobadas')) {
            this.bloqueoMatricula = true;
            this.mensajeBloqueo = mensaje;
          } else {
            alert('Error al actualizar el estudiante.');
          }
        }
      });
  }

  anular(): void {
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
        next: (): void => {
          alert('Matrícula anulada ✅');
          this.estudianteSeleccionado.estado = 'ANULADA';
          this.buscar();
        },
        error: (err: any) => {
          console.error(err);
          alert('Error al anular la matrícula.');
        }
      });
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subirComprobante(): void {
    if (!this.archivoSeleccionado || !this.estudianteSeleccionado?.id) {
      alert('Selecciona un archivo primero.');
      return;
    }

    this.subiendoComprobante = true;

    this.academicoService.subirComprobante(this.estudianteSeleccionado.id, this.archivoSeleccionado).subscribe({
      next: () => {
        this.subiendoComprobante = false;
        this.comprobanteSubido = true;
        this.archivoSeleccionado = null;
      },
      error: (err: any) => {
        console.error(err);
        this.subiendoComprobante = false;
        alert('Error al subir el comprobante. Verifica que sea PDF, JPG o PNG y pese menos de 5MB.');
      }
    });
  }
}