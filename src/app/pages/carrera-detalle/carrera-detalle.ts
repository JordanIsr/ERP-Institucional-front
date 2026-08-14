import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';

@Component({
  selector: 'app-carrera-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carrera-detalle.html',
  styleUrl: './carrera-detalle.scss',
})
export class CarreraDetalle implements OnInit {
  private service = inject(EstructuraAcademicaService);
  private route = inject(ActivatedRoute);

  carreras: any[] = [];
  carreraSeleccionadaId: string = '';
  carreraDetalle: any = null;
  cargando: boolean = false;

  // Estado para desplegar/contraer niveles en la interfaz
  nivelesAbiertos: { [nivelId: string]: boolean } = {};

  ngOnInit(): void {
    this.cargarCarreras();

    // Si viene un ID por la URL (ej: /carreras/:id/detalle)
    const idUrl = this.route.snapshot.paramMap.get('id');
    if (idUrl) {
      this.carreraSeleccionadaId = idUrl;
      this.cargarDetalleCompleto();
    }
  }

  cargarCarreras(): void {
    this.service.listarCarreras().subscribe({
      next: (data) => (this.carreras = data),
      error: (e) => console.error('Error al cargar carreras', e),
    });
  }

  onCarreraChange(): void {
    if (!this.carreraSeleccionadaId) {
      this.carreraDetalle = null;
      return;
    }
    this.cargarDetalleCompleto();
  }

  cargarDetalleCompleto(): void {
    this.cargando = true;
    this.service.obtenerDetalleCompletoCarrera(this.carreraSeleccionadaId).subscribe({
      next: (data) => {
        this.carreraDetalle = data;
        this.cargando = false;
        
        // Abrir por defecto el primer nivel de la primera malla
        if (data?.versionesMalla?.[0]?.niveles?.[0]) {
          this.nivelesAbiertos[data.versionesMalla[0].niveles[0].id] = true;
        }
      },
      error: (e) => {
        console.error('Error al cargar el detalle completo', e);
        this.cargando = false;
        alert(e.error?.message || 'Error al obtener la información de la carrera');
      },
    });
  }

  toggleNivel(nivelId: string): void {
    this.nivelesAbiertos[nivelId] = !this.nivelesAbiertos[nivelId];
  }

  isNivelAbierto(nivelId: string): boolean {
    return !!this.nivelesAbiertos[nivelId];
  }
}