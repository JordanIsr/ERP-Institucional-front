import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';

interface NivelMalla {
  numero: number;
  asignaturasIds: string[];
}

@Component({
  selector: 'app-crear-malla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-malla.html',
  styleUrl: './crear-malla.scss',
})
export class CrearMalla implements OnInit {
  private service = inject(EstructuraAcademicaService);

  carreras: any[] = [];
  asignaturasCatalogo: any[] = [];

  carreraId = '';
  nombreMalla = '';
  
  niveles: NivelMalla[] = [];

  ngOnInit(): void {
    this.cargarIniciales();
  }

  cargarIniciales(): void {
    // 1. Cargar Carreras
    const s: any = this.service;
    
    if (s.listarCarreras) {
      s.listarCarreras().subscribe({
        next: (res: any) => (this.carreras = res),
        error: (e: any) => console.error('Error cargando carreras:', e)
      });
    }

    // 2. Cargar Asignaturas con fallback seguro
    const obsAsignaturas = s.listarAsignaturasBase 
      ? s.listarAsignaturasBase() 
      : s.listarAsignaturas 
        ? s.listarAsignaturas() 
        : s.getAsignaturas 
          ? s.getAsignaturas() 
          : null;

    if (obsAsignaturas) {
      obsAsignaturas.subscribe({
        next: (res: any) => (this.asignaturasCatalogo = res),
        error: (e: any) => console.error('Error cargando asignaturas:', e)
      });
    }
  }

  cargarMallaExistente(): void {
    if (!this.carreraId) {
      this.niveles = [];
      return;
    }

    const s: any = this.service;
    const obsMalla = s.obtenerMallaPorCarrera 
      ? s.obtenerMallaPorCarrera(this.carreraId)
      : s.listarMallaPorCarrera 
        ? s.listarMallaPorCarrera(this.carreraId)
        : null;

    if (obsMalla) {
      obsMalla.subscribe({
        next: (malla: any) => {
          if (malla && malla.niveles) {
            this.nombreMalla = malla.nombre || '';
            this.niveles = malla.niveles;
          } else {
            this.inicializarNivelBase();
          }
        },
        error: () => this.inicializarNivelBase()
      });
    } else {
      this.inicializarNivelBase();
    }
  }

  private inicializarNivelBase(): void {
    this.niveles = [{ numero: 1, asignaturasIds: [''] }];
  }

  agregarNivel(): void {
    const nuevoNumero = this.niveles.length + 1;
    this.niveles.push({ numero: nuevoNumero, asignaturasIds: [''] });
  }

  eliminarNivel(index: number): void {
    this.niveles.splice(index, 1);
    this.niveles.forEach((n, i) => (n.numero = i + 1));
  }

  agregarMateriaANivel(nivelIndex: number): void {
    this.niveles[nivelIndex].asignaturasIds.push('');
  }

  removerMateriaDeNivel(nivelIndex: number, materiaIndex: number): void {
    this.niveles[nivelIndex].asignaturasIds.splice(materiaIndex, 1);
  }

  guardarMalla(): void {
    if (!this.carreraId || !this.nombreMalla) {
      alert('Seleccione una carrera e ingrese el nombre de la malla.');
      return;
    }

    const payload = {
      carreraId: this.carreraId,
      nombre: this.nombreMalla,
      niveles: this.niveles,
    };

    const s: any = this.service;
    const obsGuardar = s.guardarEstructuraMalla 
      ? s.guardarEstructuraMalla(payload)
      : s.guardarMalla 
        ? s.guardarMalla(payload)
        : null;

    if (obsGuardar) {
      obsGuardar.subscribe({
        next: () => alert('Malla curricular guardada con éxito.'),
        error: (e: any) => console.error('Error al guardar la malla:', e)
      });
    } else {
      console.log('Estructura de malla lista para backend:', payload);
      alert('Malla procesada localmente.');
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}