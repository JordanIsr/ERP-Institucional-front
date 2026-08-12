import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';

interface NivelWizard {
  numero: number;
  cantidadAsignaturas: number;
  nombresAsignaturas: string[];
}

@Component({
  selector: 'app-crear-malla-rapida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-malla-rapida.html',
  styleUrl: './crear-malla-rapida.scss',
})
export class CrearMallaRapida implements OnInit {
  private service = inject(EstructuraAcademicaService);
  private router = inject(Router);

  paso = 1; // 1: carrera+datos malla, 2: cantidad de niveles, 3: llenar asignaturas por nivel

  carreras: any[] = [];
  carreraId = '';
  nombreMalla = '';
  version = '';
  fechaVigenciaInicio = '';

  cantidadNiveles = 6;
  niveles: NivelWizard[] = [];

  enviando = false;

  trackByIndex(index: number): number {
  return index;
}

  ngOnInit(): void {
    this.service.listarCarreras().subscribe({
      next: (data) => (this.carreras = data),
      error: (err) => console.error(err),
    });
  }

  irAPaso2() {
    if (!this.carreraId || !this.nombreMalla || !this.version || !this.fechaVigenciaInicio) {
      alert('Completa carrera, nombre, versión y fecha de vigencia.');
      return;
    }
    this.paso = 2;
  }

  irAPaso3() {
    if (!this.cantidadNiveles || this.cantidadNiveles < 1) {
      alert('Indica cuántos niveles tiene esta malla.');
      return;
    }
    this.niveles = Array.from({ length: this.cantidadNiveles }, (_, i) => ({
      numero: i + 1,
      cantidadAsignaturas: 0,
      nombresAsignaturas: [],
    }));
    this.paso = 3;
  }

  actualizarCantidadAsignaturas(nivel: NivelWizard) {
    const cantidad = Math.max(0, nivel.cantidadAsignaturas || 0);
    const actual = nivel.nombresAsignaturas.length;

    if (cantidad > actual) {
      for (let i = actual; i < cantidad; i++) nivel.nombresAsignaturas.push('');
    } else {
      nivel.nombresAsignaturas = nivel.nombresAsignaturas.slice(0, cantidad);
    }
  }

  volver() {
    this.paso = Math.max(1, this.paso - 1);
  }

  guardar() {
    const nivelesVacios = this.niveles.some((n) => n.nombresAsignaturas.some((a) => !a.trim()));
    if (nivelesVacios) {
      alert('Completa el nombre de todas las asignaturas antes de guardar.');
      return;
    }

    const payload = {
      carreraId: this.carreraId,
      nombre: this.nombreMalla,
      version: this.version,
      fechaVigenciaInicio: this.fechaVigenciaInicio,
      niveles: this.niveles.map((n) => ({ numero: n.numero, asignaturas: n.nombresAsignaturas })),
    };

    this.enviando = true;
    this.service.crearMallaRapida(payload).subscribe({
      next: () => {
        alert('¡Malla creada con éxito! Recuerda activarla desde Catálogos → Mallas cuando esté lista.');
        this.router.navigate(['/catalogos']);
      },
      error: (err) => {
        this.enviando = false;
        alert(err.error?.message || 'Error al crear la malla.');
      },
    });
  }
}