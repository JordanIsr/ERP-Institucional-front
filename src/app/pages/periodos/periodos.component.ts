import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { PeriodosService } from './periodos.service';

@Component({
  selector: 'app-periodos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './periodos.component.html',
  styleUrl: './periodos.component.scss',
})
export class PeriodosComponent
  implements OnInit {

  private periodosService =
    inject(PeriodosService);

  periodos: any[] = [];

  cargando = true;

  guardandoId: string | null = null;

  nuevoPeriodo = {
    codigo: '',
    fechaInicio: '',
    fechaFin: '',
  };

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.cargando = true;

    this.periodosService
      .obtenerPeriodos()
      .subscribe({
        next: (data: any) => {
          this.periodos = data;
          this.cargando = false;
        },

        error: (err: any) => {
          console.error(
            'Error al cargar períodos:',
            err,
          );

          this.cargando = false;
        },
      });
  }

  crearPeriodo(): void {
    if (
      !this.nuevoPeriodo.codigo ||
      !this.nuevoPeriodo.fechaInicio ||
      !this.nuevoPeriodo.fechaFin
    ) {
      alert(
        'Complete todos los campos.',
      );
      return;
    }

    const patron =
      /^\d{4}-[12]$/;

    if (
      !patron.test(
        this.nuevoPeriodo.codigo,
      )
    ) {
      alert(
        'El código debe tener el formato 2026-1 o 2026-2.',
      );
      return;
    }

    this.periodosService
      .crearPeriodo(
        this.nuevoPeriodo,
      )
      .subscribe({
        next: () => {
          this.nuevoPeriodo = {
            codigo: '',
            fechaInicio: '',
            fechaFin: '',
          };

          this.cargarPeriodos();
        },

        error: (err: any) => {
          console.error(err);

          alert(
            err?.error?.message ||
              'Error al crear el período.',
          );
        },
      });
  }

  cambiarEstado(
    periodo: any,
  ): void {
    this.guardandoId =
      periodo.id;

    this.periodosService
      .cambiarEstado(
        periodo.id,
        !periodo.activo,
      )
      .subscribe({
        next: () => {
          this.guardandoId = null;
          this.cargarPeriodos();
        },

        error: (err: any) => {
          console.error(err);

          this.guardandoId = null;

          alert(
            err?.error?.message ||
              'Error al cambiar el estado.',
          );

          this.cargarPeriodos();
        },
      });
  }

  eliminarPeriodo(
    periodo: any,
  ): void {
    const confirmar = confirm(
      `¿Eliminar el período ${periodo.codigo}?`,
    );

    if (!confirmar) {
      return;
    }

    this.periodosService
      .eliminarPeriodo(periodo.id)
      .subscribe({
        next: () => {
          this.cargarPeriodos();
        },

        error: (err: any) => {
          console.error(err);

          alert(
            err?.error?.message ||
              'Error al eliminar el período.',
          );
        },
      });
  }
}