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
  versionMalla = '';
  fechaVigenciaInicio = '';
  guardando = false;
  mensaje = '';
  error = '';
  mallasCarrera: any[] = [];
  
  niveles: NivelMalla[] = [];

  ngOnInit(): void {
    this.cargarIniciales();
  }

  cargarIniciales(): void {
    this.service.listarCarreras().subscribe({
        next: (res: any) => (this.carreras = res),
        error: (e: any) => console.error('Error cargando carreras:', e)
    });

    this.service.listarAsignaturasCatalogo().subscribe({
        next: (res: any) => (this.asignaturasCatalogo = res),
        error: (e: any) => console.error('Error cargando asignaturas:', e)
    });
  }

  cargarMallaExistente(): void {
    if (!this.carreraId) {
      this.niveles = [];
      return;
    }

    this.nombreMalla = '';
    this.versionMalla = '';
    this.fechaVigenciaInicio = '';
    this.inicializarNivelBase();
    this.service.listarVersionesMalla(this.carreraId).subscribe({
      next: (mallas: any[]) => (this.mallasCarrera = mallas),
      error: () => (this.mallasCarrera = []),
    });
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
    this.error = '';
    this.mensaje = '';
    if (!this.carreraId || !this.nombreMalla || !this.versionMalla || !this.fechaVigenciaInicio) {
      this.error = 'Selecciona carrera y completa nombre, versión y fecha de vigencia.';
      return;
    }

    const nivelesValidos = this.niveles.map((nivel) => {
      const nombres = nivel.asignaturasIds
        .filter(Boolean)
        .map((id) => this.asignaturasCatalogo.find((asignatura) => asignatura.id === id)?.nombre)
        .filter(Boolean) as string[];
      return { numero: nivel.numero, asignaturas: [...new Set(nombres)] };
    });

    if (nivelesValidos.length === 0 || nivelesValidos.some((nivel) => nivel.asignaturas.length === 0)) {
      this.error = 'Cada nivel debe contener al menos una asignatura.';
      return;
    }

    const payload = {
      carreraId: this.carreraId,
      nombre: this.nombreMalla,
      version: this.versionMalla,
      fechaVigenciaInicio: this.fechaVigenciaInicio,
      niveles: nivelesValidos,
    };

    this.guardando = true;
    this.service.crearMallaRapida(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Malla creada como PRÓXIMA. Revísala y actívala para poder ofertarla.';
        this.cargarMallaExistente();
      },
      error: (e: any) => {
        this.guardando = false;
        this.error = e?.error?.message ?? 'No se pudo crear la malla.';
      },
    });
  }

  activarMalla(malla: any): void {
    if (!confirm(`¿Activar la malla "${malla.nombre}"? La malla activa anterior quedará histórica.`)) return;
    this.service.activarVersionMalla(malla.id).subscribe({
      next: () => {
        this.mensaje = 'Malla activada correctamente.';
        this.cargarMallaExistente();
      },
      error: (e: any) => (this.error = e?.error?.message ?? 'No se pudo activar la malla.'),
    });
  }

  trackByFn(index: number): number {
    return index;
  }
}
