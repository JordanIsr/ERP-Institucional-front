import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';
import { ParalelosService, Aula, ParaleloPayload } from '../../core/service/paralelos.service';

@Component({
  selector: 'app-paralelos-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paralelos-horarios.html',
  styleUrl: './paralelos-horarios.scss'
})
export class ParalelosHorarios implements OnInit {
  private estructuraService = inject(EstructuraAcademicaService);
  private paralelosService = inject(ParalelosService);

  periodosCarrera: any[] = [];
  nivelesMalla: any[] = [];
  aulas: Aula[] = [];

  // Formulario Dinámico
  periodoCarreraId = '';
  nivelId = '';
  nombreParalelo = 'Paralelo A';
  aulaSeleccionadaId = '';
  cupoAuto = 0;

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    const s: any = this.estructuraService;
    
    // Carga dinámica de Periodos-Carrera desde el Backend
    if (s.listarPeriodosCarrera) {
      s.listarPeriodosCarrera().subscribe({
        next: (res: any) => (this.periodosCarrera = res),
        error: (e: any) => console.error(e)
      });
    }

    this.paralelosService.listarAulas().subscribe({
      next: (res) => (this.aulas = res),
      error: (e: any) => console.error(e)
    });
  }

  // Al seleccionar el Periodo-Carrera, cargamos sus niveles asociados
  alCambiarPeriodo(): void {
    if (!this.periodoCarreraId) {
      this.nivelesMalla = [];
      return;
    }

    const s: any = this.estructuraService;
    const obs = s.obtenerNivelesPorPeriodoCarrera 
      ? s.obtenerNivelesPorPeriodoCarrera(this.periodoCarreraId) 
      : null;

    if (obs) {
      obs.subscribe({
        next: (niveles: any) => (this.nivelesMalla = niveles),
        error: () => (this.nivelesMalla = [])
      });
    }
  }

  // Automatización de cupos desde el catálogo de Aulas
  alSeleccionarAula(): void {
    const aulaEncontrada = this.aulas.find(a => a.id === this.aulaSeleccionadaId);
    this.cupoAuto = aulaEncontrada ? aulaEncontrada.capacidadMaxima : 0;
  }

  guardarParalelo(): void {
    if (!this.periodoCarreraId || !this.nivelId || !this.nombreParalelo) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    // Payload corregido alineado con la interfaz del servicio
    const payload: ParaleloPayload = {
      periodoCarreraId: this.periodoCarreraId,
      nivelId: this.nivelId,
      nombre: this.nombreParalelo,
      aulaId: this.aulaSeleccionadaId || undefined,
      cupoMaximo: this.cupoAuto > 0 ? this.cupoAuto : undefined
    };

    this.paralelosService.guardarParalelo(payload).subscribe({
      next: () => alert('Paralelo guardado exitosamente en la base de datos.'),
      error: (e: any) => console.error('Error al guardar paralelo:', e)
    });
  }
}