import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EstructuraAcademicaService } from '../../core/service/estructura-academica.service';
import { MatriculasService, OfertaInicialSecretaria } from '../../core/service/matriculas.service';

interface Paso { titulo: string; detalle: string; ruta: string; completo: boolean; alerta?: string; }

@Component({ selector: 'app-configuracion-academica', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './configuracion-academica.html', styleUrl: './configuracion-academica.scss' })
export class ConfiguracionAcademica implements OnInit {
  private estructura = inject(EstructuraAcademicaService);
  private matriculas = inject(MatriculasService);
  cargando = true;
  error = '';
  periodos: any[] = []; carreras: any[] = []; mallas: any[] = []; asignaturas: any[] = []; docentes: any[] = []; centros: any[] = []; aulas: any[] = []; ofertas: any[] = []; ofertaInicial: OfertaInicialSecretaria[] = [];

  ngOnInit(): void {
    forkJoin({
      periodos: this.estructura.listarPeriodos(), carreras: this.estructura.listarCarreras(), mallas: this.estructura.listarVersionesMalla(),
      asignaturas: this.estructura.listarAsignaturasCatalogo(), docentes: this.estructura.listarDocentes(), centros: this.estructura.listarCentrosEstudio(),
      aulas: this.estructura.listarAulas(false), ofertas: this.estructura.listarPeriodoCarrera(), ofertaInicial: this.matriculas.obtenerOfertaInicial(),
    }).subscribe({
      next: (d: any) => { Object.assign(this, d); this.cargando = false; },
      error: (err) => { this.error = err.error?.message || 'No se pudo calcular el estado de configuración.'; this.cargando = false; },
    });
  }

  get mallasActivas(): any[] { return this.mallas.filter((m) => m.estado === 'ACTIVA'); }
  get carrerasActivas(): any[] { return this.carreras.filter((c) => c.estado === 'ACTIVA'); }
  get ofertasActivas(): any[] { return this.ofertas.filter((o) => o.estado === 'ACTIVA'); }
  get ofertasListas(): OfertaInicialSecretaria[] { return this.ofertaInicial.filter((o) => o.disponible); }
  get ofertasPendientes(): OfertaInicialSecretaria[] { return this.ofertaInicial.filter((o) => !o.disponible); }
  get catalogosCompletos(): boolean { return this.carrerasActivas.length > 0 && this.asignaturas.length > 0 && this.docentes.length > 0 && this.centros.some((c) => c.estado === 'ACTIVO') && this.aulas.some((a) => a.activo); }

  get pasos(): Paso[] {
    const mallasCompletas = this.carrerasActivas.length > 0 && this.carrerasActivas.every((c) => this.mallasActivas.some((m) => m.carrera?.id === c.id));
    return [
      { titulo: 'Periodos académicos', detalle: `${this.periodos.length} periodo(s) registrados`, ruta: '/periodos-flujo', completo: this.periodos.length > 0, alerta: this.periodos.length ? undefined : 'Crea al menos un periodo.' },
      { titulo: 'Catálogos base', detalle: `${this.carreras.length} carreras · ${this.asignaturas.length} asignaturas · ${this.docentes.length} docentes`, ruta: '/catalogos', completo: this.catalogosCompletos, alerta: this.catalogosCompletos ? undefined : 'Faltan carreras, asignaturas, docentes, centros o aulas.' },
      { titulo: 'Carreras y mallas', detalle: `${this.mallasActivas.length} malla(s) activa(s) para ${this.carrerasActivas.length} carrera(s) activas`, ruta: '/crear-malla', completo: mallasCompletas, alerta: mallasCompletas ? undefined : 'Cada carrera que se ofertará necesita una malla activa con niveles y materias.' },
      { titulo: 'Carreras por periodo', detalle: `${this.ofertasActivas.length} asociación(es) activas`, ruta: '/carreras-periodo', completo: this.ofertasActivas.length > 0, alerta: this.ofertasActivas.length ? undefined : 'Une periodo, carrera, centro y jornada.' },
      { titulo: 'Paralelos y docentes', detalle: `${this.ofertasListas.length} oferta(s) listas · ${this.ofertasPendientes.length} pendiente(s)`, ruta: '/paralelos-horarios', completo: this.ofertasListas.length > 0 && this.ofertasPendientes.length === 0, alerta: this.ofertasPendientes.length ? 'Hay ofertas sin paralelo, sin cupo o con materias/docentes pendientes.' : undefined },
    ];
  }
}
