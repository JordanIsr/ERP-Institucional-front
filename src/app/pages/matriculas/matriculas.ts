import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EstudiantesService } from './estudiantes.service';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './matriculas.html',
  styleUrls: ['./matriculas.scss'],
})
export class Matriculas {

  private fb = inject(FormBuilder);
  private estudiantesService = inject(EstudiantesService);

  guardando = false;

  matriculaForm = this.fb.group({

    cedula: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ],
    ],

    nombres: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],

    apellidos: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],

    correo: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    telefono: [
      '',
      [
        Validators.pattern(/^[0-9]{10}$/),
      ],
    ],

  });


  // ==============================
  // SOLO NÚMEROS
  // ==============================

  soloNumeros(event: KeyboardEvent): boolean {

    const charCode =
      event.which
        ? event.which
        : event.keyCode;

    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {

      event.preventDefault();

      return false;
    }

    return true;
  }


  // ==============================
  // LIMITAR A 10 DÍGITOS
  // ==============================

  validarLongitud(
    event: Event,
    controlName: string,
  ): void {

    const input =
      event.target as HTMLInputElement;

    const valorLimpio =
      input.value
        .replace(/[^0-9]/g, '')
        .slice(0, 10);

    input.value = valorLimpio;

    this.matriculaForm
      .get(controlName)
      ?.setValue(valorLimpio);
  }


  // ==============================
  // REGISTRAR
  // ==============================

  registrar(): void {

    this.matriculaForm.markAllAsTouched();

    if (this.matriculaForm.invalid) {

      alert(
        'Por favor, revisa los campos del formulario.'
      );

      return;
    }

    this.guardando = true;

    const datos = {
      cedula:
        this.matriculaForm.value.cedula!,

      nombres:
        this.matriculaForm.value.nombres!,

      apellidos:
        this.matriculaForm.value.apellidos!,

      correo:
        this.matriculaForm.value.correo!,

      telefono:
        this.matriculaForm.value.telefono || undefined,
    };


    this.estudiantesService
      .crearEstudiante(datos)
      .subscribe({

        next: (estudiante) => {

          this.guardando = false;

          alert(
            `Estudiante registrado correctamente.\n\n` +
            `Cédula: ${estudiante.cedula}\n` +
            `Nombre: ${estudiante.nombres} ${estudiante.apellidos}`
          );

          this.limpiarFormulario();

        },

        error: (error) => {

          this.guardando = false;

          console.error(
            'Error al registrar estudiante:',
            error
          );

          if (error.status === 409) {

            alert(
              'Ya existe un estudiante registrado con esa cédula.'
            );

            return;
          }

          if (error.status === 400) {

            alert(
              'Los datos enviados no son válidos. Revisa el formulario.'
            );

            return;
          }

          alert(
            'No se pudo registrar el estudiante.'
          );
        },

      });
  }


  // ==============================
  // LIMPIAR
  // ==============================

  limpiarFormulario(): void {

    this.matriculaForm.reset();

    this.matriculaForm.markAsPristine();
    this.matriculaForm.markAsUntouched();
  }

}