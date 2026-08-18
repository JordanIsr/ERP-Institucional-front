import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

interface Carrera {
  id: string;
  nombre: string;
  codigo: string;
  estado: string;
}

interface Periodo {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface PeriodoCarrera {
  id: string;

  periodo: {
    id: string;
    nombre: string;
  };

  carrera: {
    id: string;
    nombre: string;
  };

  jornada: string;
}

interface Nivel {
  id: string;
  numero: number;
  nombre?: string;
}

interface Paralelo {
  id: string;
  nombre: string;
  cupoMaximo: number;

  nivel: Nivel;

  periodoCarrera: {
    id: string;
  };
}

interface EstudianteMatriculado {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  correo?: string;
  telefono?: string;

  carrera: string;
  periodo: string;
  jornada: string;

  paralelo: string;
  nivel: string;

  n1p: number;
  n2p: number;
  recuperacion: number;
  promedio: number;
}

interface SolicitudMatricula {
  id: string;

  estudiante: {
    id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    correo?: string;
    telefono?: string;
  };

  periodoCarrera: PeriodoCarrera;

  paralelo: Paralelo;

  estado: string;
}

@Component({
  selector: 'app-registrar-notas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-notas.html',
  styleUrls: ['./registrar-notas.scss']
})
export class RegistarNotas implements OnInit {

  private http = inject(HttpClient);

  // =========================
  // DATOS PARA LOS SELECT
  // =========================

  carreras: Carrera[] = [];

  periodos: Periodo[] = [];

  periodosCarrera: PeriodoCarrera[] = [];

  paralelos: Paralelo[] = [];


  // =========================
  // FILTROS
  // =========================

  carreraFiltro: string = '';

  periodoFiltro: string = '';

  paraleloFiltro: string = '';


  // =========================
  // RESULTADOS
  // =========================

  estudiantes: EstudianteMatriculado[] = [];

  busquedaRealizada = false;


  ngOnInit(): void {
    this.cargarCarreras();
    this.cargarPeriodos();
  }


  // =========================
  // CARGAR CARRERAS
  // =========================

  cargarCarreras(): void {

    this.http.get<Carrera[]>('/api/carreras').subscribe({
      next: (data) => {
        this.carreras = data;
      },

      error: (error) => {
        console.error('Error al cargar carreras:', error);
      }
    });

  }


  // =========================
  // CARGAR PERIODOS
  // =========================

  cargarPeriodos(): void {

    this.http.get<Periodo[]>('/api/periodos').subscribe({
      next: (data) => {
        this.periodos = data;
      },

      error: (error) => {
        console.error('Error al cargar periodos:', error);
      }
    });

  }


  // =========================
  // CUANDO CAMBIA CARRERA
  // =========================

  cambioCarrera(): void {

    this.paralelos = [];

    this.paraleloFiltro = '';

    this.periodosCarrera = [];

    if (!this.carreraFiltro) {
      return;
    }

    this.cargarPeriodosCarrera();

  }


  // =========================
  // CUANDO CAMBIA PERIODO
  // =========================

  cambioPeriodo(): void {

    this.paralelos = [];

    this.paraleloFiltro = '';

    this.periodosCarrera = [];

    if (!this.periodoFiltro || !this.carreraFiltro) {
      return;
    }

    this.cargarPeriodosCarrera();

  }


  // =========================
  // BUSCAR PERIODO-CARRERA
  // =========================

  cargarPeriodosCarrera(): void {

    if (!this.carreraFiltro || !this.periodoFiltro) {
      return;
    }

    let params = new HttpParams()
      .set('carreraId', this.carreraFiltro)
      .set('periodoId', this.periodoFiltro);


    this.http
      .get<PeriodoCarrera[]>('/api/periodo-carrera', { params })
      .subscribe({

        next: (data) => {

          this.periodosCarrera = data;

          this.cargarParalelos();

        },

        error: (error) => {
          console.error('Error al cargar periodo-carrera:', error);
        }

      });

  }


  // =========================
  // CARGAR PARALELOS
  // =========================

  cargarParalelos(): void {

    this.paralelos = [];

    if (this.periodosCarrera.length === 0) {
      return;
    }

    const periodoCarreraId = this.periodosCarrera[0].id;

    const params = new HttpParams()
      .set('periodoCarreraId', periodoCarreraId);


    this.http
      .get<Paralelo[]>('/api/paralelos', { params })
      .subscribe({

        next: (data) => {
          this.paralelos = data;
        },

        error: (error) => {
          console.error('Error al cargar paralelos:', error);
        }

      });

  }


  // =========================
  // BUSCAR ESTUDIANTES
  // =========================

  buscarEstudiantes(): void {

    let params = new HttpParams()
      .set('estado', 'APROBADA');


    if (this.carreraFiltro) {
      params = params.set('carreraId', this.carreraFiltro);
    }

    if (this.periodoFiltro) {
      params = params.set('periodoId', this.periodoFiltro);
    }

    if (this.paraleloFiltro) {
      params = params.set('paraleloId', this.paraleloFiltro);
    }


    this.http
      .get<SolicitudMatricula[]>('/api/solicitudes-matricula', { params })
      .subscribe({

        next: (data) => {

          this.busquedaRealizada = true;

          this.estudiantes = data.map((solicitud) => {

            const estudiante = solicitud.estudiante;

            const periodoCarrera = solicitud.periodoCarrera;

            const paralelo = solicitud.paralelo;


            const resultado: EstudianteMatriculado = {

              id: estudiante.id,

              cedula: estudiante.cedula,

              nombres: estudiante.nombres,

              apellidos: estudiante.apellidos,

              correo: estudiante.correo,

              telefono: estudiante.telefono,

              carrera: periodoCarrera.carrera.nombre,

              periodo: periodoCarrera.periodo.nombre,

              jornada: periodoCarrera.jornada,

              paralelo: paralelo.nombre,

              nivel: paralelo.nivel.nombre
                ?? `Nivel ${paralelo.nivel.numero}`,

              n1p: 0,

              n2p: 0,

              recuperacion: 0,

              promedio: 0

            };


            this.calcularPromedio(resultado);

            return resultado;

          });

        },

        error: (error) => {

          console.error(
            'Error al obtener estudiantes matriculados:',
            error
          );

          this.busquedaRealizada = true;

          this.estudiantes = [];

        }

      });

  }


  // =========================
  // CALCULAR PROMEDIO
  // =========================

  calcularPromedio(
    estudiante: EstudianteMatriculado
  ): void {

    const n1 = Number(estudiante.n1p) || 0;

    const n2 = Number(estudiante.n2p) || 0;

    const recuperacion =
      Number(estudiante.recuperacion) || 0;


    let promedio = (n1 + n2) / 2;


    if (
      recuperacion > 0 &&
      recuperacion > Math.min(n1, n2)
    ) {

      promedio =
        (Math.max(n1, n2) + recuperacion) / 2;

    }


    estudiante.promedio =
      Math.round(promedio * 100) / 100;

  }


  // =========================
  // GUARDAR NOTAS
  // =========================

  guardarNotas(): void {

    const payload = this.estudiantes.map(estudiante => ({

      estudianteId: estudiante.id,

      n1p: estudiante.n1p,

      n2p: estudiante.n2p,

      recuperacion: estudiante.recuperacion,

      promedio: estudiante.promedio

    }));


    this.http
      .post('/api/academico/registrar-nota', payload)
      .subscribe({

        next: () => {

          alert(
            '¡Calificaciones guardadas con éxito!'
          );

        },

        error: (error) => {

          console.error(
            'Error al guardar notas:',
            error
          );

          alert(
            'Error al guardar las calificaciones.'
          );

        }

      });

  }

}