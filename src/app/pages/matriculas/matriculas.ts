import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EstudiantesService } from './estudiantes.service';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';
import { MatriculasService } from '../../core/service/matriculas.service';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './matriculas.html',
  styleUrls: ['./matriculas.scss'],
})
export class Matriculas implements OnInit {

  private fb = inject(FormBuilder);
  private estudiantesService = inject(EstudiantesService);
  private estructuraService = inject(EstructuraAcademicaService);
  private matriculasService = inject(MatriculasService);

  guardando = false;
  cargandoOferta = true;
  errorGeneral = '';
  mensajeExito = '';
  ofertas: any[] = [];
  paralelos: any[] = [];
  periodoCarreraId = '';
  paraleloId = '';
  estudianteCreado: any = null;

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

  ngOnInit(): void {
    this.estructuraService.listarPeriodoCarrera().subscribe({
      next: (ofertas: any[]) => {
        this.ofertas = ofertas.filter((oferta) =>
          oferta.estado !== 'INACTIVA' &&
          oferta.periodo?.estado !== 'CERRADO' &&
          oferta.versionMalla?.estado === 'ACTIVA',
        );
        this.cargandoOferta = false;
      },
      error: (error) => {
        this.errorGeneral = this.mensajeError(error, 'No se pudo cargar la oferta académica.');
        this.cargandoOferta = false;
      },
    });
  }

  cambiarOferta(): void {
    this.paraleloId = '';
    this.paralelos = [];
    if (!this.periodoCarreraId) return;
    this.estructuraService.listarParalelos(this.periodoCarreraId).subscribe({
      next: (paralelos: any[]) => {
        this.paralelos = paralelos.filter((paralelo) => paralelo.nivel?.numero === 1);
      },
      error: (error) => {
        this.errorGeneral = this.mensajeError(error, 'No se pudieron cargar los paralelos de primer nivel.');
      },
    });
  }

  get ofertaSeleccionada(): any {
    return this.ofertas.find((oferta) => oferta.id === this.periodoCarreraId);
  }

  get paraleloSeleccionado(): any {
    return this.paralelos.find((paralelo) => paralelo.id === this.paraleloId);
  }


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

    if (this.matriculaForm.invalid || !this.periodoCarreraId || !this.paraleloId) {

      alert(
        'Completa los datos personales y selecciona oferta académica y paralelo.'
      );

      return;
    }

    this.guardando = true;
    this.errorGeneral = '';
    this.mensajeExito = '';

    if (this.estudianteCreado?.id) {
      this.crearMatriculaOficial(this.estudianteCreado.id);
      return;
    }

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
          this.estudianteCreado = estudiante;
          this.crearMatriculaOficial(estudiante.id);
        },

        error: (error) => {

          this.guardando = false;

          console.error(
            'Error al registrar estudiante:',
            error
          );

          if (error.status === 409) {

            this.errorGeneral = 'Ya existe un estudiante con esa cédula. Para un estudiante antiguo usa la revisión de solicitudes.';

            return;
          }

          if (error.status === 400) {

            this.errorGeneral = this.mensajeError(error, 'Los datos enviados no son válidos.');

            return;
          }

          this.errorGeneral = this.mensajeError(error, 'No se pudo registrar el estudiante.');
        },

      });
  }

  private crearMatriculaOficial(estudianteId: string): void {
    this.matriculasService.crearDesdeSecretaria({
      estudianteId,
      periodoCarreraId: this.periodoCarreraId,
      paraleloId: this.paraleloId,
      tipo: 'NUEVA',
    }).subscribe({
      next: () => {
        const estudiante = this.estudianteCreado;
        this.guardando = false;
        this.mensajeExito = `Matrícula creada correctamente para ${estudiante?.nombres ?? ''} ${estudiante?.apellidos ?? ''}.`;
        this.limpiarFormulario(false);
      },
      error: (error) => {
        this.guardando = false;
        this.errorGeneral = this.mensajeError(error, 'La ficha fue creada, pero no se pudo completar la matrícula. Corrige la oferta o el paralelo y vuelve a intentar.');
      },
    });
  }


  // ==============================
  // LIMPIAR
  // ==============================

  limpiarFormulario(limpiarMensajes = true): void {

    this.matriculaForm.reset();

    this.matriculaForm.markAsPristine();
    this.matriculaForm.markAsUntouched();
    this.periodoCarreraId = '';
    this.paraleloId = '';
    this.paralelos = [];
    this.estudianteCreado = null;
    if (limpiarMensajes) {
      this.errorGeneral = '';
      this.mensajeExito = '';
    }
  }

  private mensajeError(error: any, predeterminado: string): string {
    const mensaje = error?.error?.message;
    return Array.isArray(mensaje) ? mensaje.join(' ') : mensaje ?? predeterminado;
  }

}
