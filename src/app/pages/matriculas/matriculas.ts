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
import { MatriculasService } from '../../core/service/matriculas.service';
import {
  OfertaInicialSecretaria,
  ParaleloOfertaInicial,
} from '../../core/service/matriculas.service';

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
  private matriculasService = inject(MatriculasService);

  guardando = false;
  cargandoOferta = true;
  errorGeneral = '';
  mensajeExito = '';
  ofertas: OfertaInicialSecretaria[] = [];
  paralelos: ParaleloOfertaInicial[] = [];
  carreraId = '';
  periodoId = '';
  jornada = '';
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
    this.matriculasService.obtenerOfertaInicial().subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
        this.cargandoOferta = false;
      },
      error: (error) => {
        this.errorGeneral = this.mensajeError(error, 'No se pudo cargar la oferta académica.');
        this.cargandoOferta = false;
      },
    });
  }

  get carrerasDisponibles(): Array<{ id: string; nombre: string }> {
    return this.unicos(
      this.ofertas.map((oferta) => oferta.carrera),
      (carrera) => carrera.id,
    );
  }

  get periodosDisponibles(): Array<{ id: string; nombre: string; estado: string }> {
    return this.unicos(
      this.ofertas
        .filter((oferta) => oferta.carrera.id === this.carreraId)
        .map((oferta) => oferta.periodo),
      (periodo) => periodo.id,
    );
  }

  get jornadasDisponibles(): Array<{
    nombre: string;
    cupoMaximo: number;
    cuposOcupados: number;
    cuposDisponibles: number;
    disponible: boolean;
    motivos: string[];
  }> {
    const agrupadas = new Map<string, {
      nombre: string;
      cupoMaximo: number;
      cuposOcupados: number;
      cuposDisponibles: number;
      disponible: boolean;
      motivos: string[];
    }>();

    for (const oferta of this.ofertas.filter((item) =>
      item.carrera.id === this.carreraId &&
      item.periodo.id === this.periodoId,
    )) {
      const actual = agrupadas.get(oferta.jornada) ?? {
        nombre: oferta.jornada,
        cupoMaximo: 0,
        cuposOcupados: 0,
        cuposDisponibles: 0,
        disponible: false,
        motivos: [],
      };
      actual.cupoMaximo += oferta.cupoMaximo;
      actual.cuposOcupados += oferta.cuposOcupados;
      actual.cuposDisponibles += oferta.cuposDisponibles;
      actual.disponible = actual.disponible || oferta.disponible;
      if (oferta.motivoNoDisponible && !actual.motivos.includes(oferta.motivoNoDisponible)) {
        actual.motivos.push(oferta.motivoNoDisponible);
      }
      agrupadas.set(oferta.jornada, actual);
    }

    return [...agrupadas.values()];
  }

  get ofertasFiltradas(): OfertaInicialSecretaria[] {
    return this.ofertas.filter((oferta) =>
      oferta.carrera.id === this.carreraId &&
      oferta.periodo.id === this.periodoId &&
      oferta.jornada === this.jornada,
    );
  }

  cambiarCarrera(): void {
    this.periodoId = '';
    this.jornada = '';
    this.periodoCarreraId = '';
    this.paraleloId = '';
    this.paralelos = [];
  }

  cambiarPeriodo(): void {
    this.jornada = '';
    this.periodoCarreraId = '';
    this.paraleloId = '';
    this.paralelos = [];
  }

  cambiarJornada(): void {
    this.periodoCarreraId = '';
    this.paraleloId = '';
    this.paralelos = [];
    if (this.ofertasFiltradas.length === 1) {
      this.periodoCarreraId = this.ofertasFiltradas[0].periodoCarreraId;
      this.cambiarOferta();
    }
  }

  cambiarOferta(): void {
    this.paraleloId = '';
    this.paralelos = this.ofertaSeleccionada?.paralelos ?? [];
  }

  get ofertaSeleccionada(): OfertaInicialSecretaria | undefined {
    return this.ofertas.find((oferta) => oferta.periodoCarreraId === this.periodoCarreraId);
  }

  get paraleloSeleccionado(): ParaleloOfertaInicial | undefined {
    return this.paralelos.find((paralelo) => paralelo.id === this.paraleloId);
  }

  get mensajeConfiguracionOferta(): string {
    if (this.cargandoOferta || this.errorGeneral || this.ofertas.length > 0) return '';
    return 'No existe una oferta lista para matrícula nueva. Completa en este orden: malla ACTIVA con primer nivel y materias → oferta en Periodos → paralelo de primer nivel con aula → asignación de docentes y materias.';
  }

  private unicos<T>(elementos: T[], clave: (elemento: T) => string): T[] {
    return [...new Map(elementos.map((elemento) => [clave(elemento), elemento])).values()];
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

    if (
      this.matriculaForm.invalid ||
      !this.carreraId ||
      !this.periodoId ||
      !this.jornada ||
      !this.periodoCarreraId ||
      !this.paraleloId
    ) {

      alert(
        this.ofertas.length === 0
          ? this.mensajeConfiguracionOferta
          : 'Completa los datos personales y selecciona oferta académica y paralelo.'
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
    this.carreraId = '';
    this.periodoId = '';
    this.jornada = '';
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
