import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicoService } from '../../core/service/academico.service';

@Component({
  selector: 'app-comprobantes-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comprobantes-pendientes.html',
  styleUrl: './comprobantes-pendientes.scss',
})
export class ComprobantesPendientes implements OnInit {
  private academicoService = inject(AcademicoService);

  pendientes: any[] = [];
  cargando = true;
  urlBase = 'http://localhost:3000';

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.academicoService.listarComprobantesPendientes().subscribe({
      next: (data: any) => {
        this.pendientes = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  aprobar(id: string) {
    this.academicoService.aprobarComprobante(id).subscribe({
      next: () => {
        alert('Comprobante aprobado ✅');
        this.cargar();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al aprobar el comprobante.');
      }
    });
  }

  rechazar(id: string) {
    const confirmar = confirm('¿Rechazar este comprobante?');
    if (!confirmar) return;

    this.academicoService.rechazarComprobante(id).subscribe({
      next: () => {
        alert('Comprobante rechazado');
        this.cargar();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al rechazar el comprobante.');
      }
    });
  }
}