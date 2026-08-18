import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TipoMatricula =
  | 'NUEVA'
  | 'REGULAR'
  | 'REPETICION'
  | 'REINICIO_MALLA';

export type TipoDocumentoMatricula =
  | 'CEDULA'
  | 'CERTIFICADO_NO_ADEUDAR'
  | 'COMPROBANTE_PAGO';

export interface MateriaOpcionMatricula {
  asignaturaParaleloId: string;
  asignaturaId: string;
  codigo: string;
  nombre: string;
  docente: string;
  esRepeticion?: boolean;
}

export interface CrearMatriculaSecretaria {
  estudianteId: string;
  periodoCarreraId: string;
  paraleloId: string;
  tipo: 'NUEVA';
}

export interface OpcionMatricula {
  periodoCarreraId: string;

  periodo: {
    id: string;
    nombre: string;
  };

  carrera: {
    id: string;
    nombre: string;
  };

  versionMalla: {
    id: string;
    nombre: string;
    version: string;
  };

  nivel: {
    id: string;
    numero: number;
    nombre?: string;
  };

  jornada: string;

  centroEstudio: {
    id: string;
    nombre: string;
  };

  paralelo: {
    id: string;
    nombre: string;
    cupoMaximo: number;
    cuposOcupados: number;
    cuposDisponibles: number;
  };

  materias: MateriaOpcionMatricula[];
}

export interface MateriaReprobada {
  id: string;
  codigo: string;
  nombre: string;
  promedio: number | null;
}

export interface OpcionesMatriculaResponse {
  puedeSolicitar: boolean;

  situacion:
    | 'ESTUDIANTE_NUEVO'
    | 'MATRICULA_SIN_FINALIZAR'
    | 'REPETICION_MISMA_MALLA'
    | 'REINICIO_POR_CAMBIO_MALLA'
    | 'SIGUIENTE_NIVEL'
    | 'PARALELO_INCOMPLETO'
    | 'MALLA_COMPLETADA'
    | string;

  motivo: string | null;

  tipoMatricula: TipoMatricula | null;

  documentoRequerido:
    | TipoDocumentoMatricula
    | null;

  matriculaAnterior: {
    id: string;
    periodo: string;
    malla?: string;
    nivel: string;
    numeroNivel?: number;
    estado?: string;
    materiasReprobadas?: MateriaReprobada[];
  } | null;

  opciones: OpcionMatricula[];
}

export interface MatriculaOficial {
  id: string;
  tipo: TipoMatricula;
  estado:
    | 'ACTIVA'
    | 'FINALIZADA'
    | 'ANULADA';

  periodo: {
    id: string;
    nombre: string;
  };

  periodoCarrera: any;
  paralelo: any;
  versionMalla: any;
  nivel: any;
  asignaturas: any[];
  fechaMatricula: string;
}

@Injectable({
  providedIn: 'root',
})
export class MatriculasService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/api/matriculas';

  obtenerOpcionesPermitidas():
    Observable<OpcionesMatriculaResponse> {
    return this.http.get<OpcionesMatriculaResponse>(
      `${this.apiUrl}/opciones-permitidas`,
    );
  }

  obtenerMisMatriculas():
    Observable<MatriculaOficial[]> {
    return this.http.get<MatriculaOficial[]>(
      `${this.apiUrl}/mias`,
    );
  }

  crearDesdeSecretaria(
    datos: CrearMatriculaSecretaria,
  ): Observable<MatriculaOficial> {
    return this.http.post<MatriculaOficial>(
      this.apiUrl,
      datos,
    );
  }
}
