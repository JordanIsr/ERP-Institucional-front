import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstructuraAcademicaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ---------- CARRERAS ----------
  listarCarreras(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carreras`, { headers: this.headers() });
  }
  crearCarrera(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/carreras`, data, { headers: this.headers() });
  }
  editarCarrera(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/carreras/${id}`, data, { headers: this.headers() });
  }
  eliminarCarrera(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carreras/${id}`, { headers: this.headers() });
  }

  // ---------- PERIODOS ----------
  listarPeriodos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/periodos`, { headers: this.headers() });
  }
  crearPeriodo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/periodos`, data, { headers: this.headers() });
  }
  editarPeriodo(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/periodos/${id}`, data, { headers: this.headers() });
  }
  eliminarPeriodo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/periodos/${id}`, { headers: this.headers() });
  }

  // ---------- DOCENTES ----------
  listarDocentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docentes`, { headers: this.headers() });
  }
  crearDocente(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/docentes`, data, { headers: this.headers() });
  }
  editarDocente(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/docentes/${id}`, data, { headers: this.headers() });
  }
  eliminarDocente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/docentes/${id}`, { headers: this.headers() });
  }

  // ---------- ASIGNATURAS (catálogo) ----------
  listarAsignaturasCatalogo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignaturas-catalogo`, { headers: this.headers() });
  }
  crearAsignaturaCatalogo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignaturas-catalogo`, data, { headers: this.headers() });
  }
  editarAsignaturaCatalogo(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/asignaturas-catalogo/${id}`, data, { headers: this.headers() });
  }
  eliminarAsignaturaCatalogo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/asignaturas-catalogo/${id}`, { headers: this.headers() });
  }

  // ---------- VERSIONES DE MALLA ----------
  listarVersionesMalla(carreraId?: string): Observable<any> {
    const url = carreraId
      ? `${this.apiUrl}/versiones-malla?carreraId=${carreraId}`
      : `${this.apiUrl}/versiones-malla`;
    return this.http.get(url, { headers: this.headers() });
  }
  crearVersionMalla(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/versiones-malla`, data, { headers: this.headers() });
  }
  editarVersionMalla(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/versiones-malla/${id}`, data, { headers: this.headers() });
  }
  activarVersionMalla(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/versiones-malla/${id}/activar`, {}, { headers: this.headers() });
  }
  eliminarVersionMalla(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/versiones-malla/${id}`, { headers: this.headers() });
  }

  // ---------- NIVELES ----------
  listarNiveles(versionMallaId?: string): Observable<any> {
    const url = versionMallaId
      ? `${this.apiUrl}/niveles?versionMallaId=${versionMallaId}`
      : `${this.apiUrl}/niveles`;
    return this.http.get(url, { headers: this.headers() });
  }
  crearNivel(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/niveles`, data, { headers: this.headers() });
  }
  editarNivel(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/niveles/${id}`, data, { headers: this.headers() });
  }
  eliminarNivel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/niveles/${id}`, { headers: this.headers() });
  }

  // ---------- DETALLE MALLA ----------
  listarDetalleMalla(nivelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/detalle-malla?nivelId=${nivelId}`, { headers: this.headers() });
  }
  agregarAsignaturaANivel(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/detalle-malla`, data, { headers: this.headers() });
  }
  quitarAsignaturaDeNivel(detalleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/detalle-malla/${detalleId}`, { headers: this.headers() });
  }

  // ---------- PERIODO-CARRERA ----------
  listarPeriodoCarrera(filtros?: { periodoId?: string; carreraId?: string }): Observable<any> {
    const params = new URLSearchParams();
    if (filtros?.periodoId) params.set('periodoId', filtros.periodoId);
    if (filtros?.carreraId) params.set('carreraId', filtros.carreraId);
    const qs = params.toString();
    return this.http.get(`${this.apiUrl}/periodo-carrera${qs ? '?' + qs : ''}`, { headers: this.headers() });
  }
  crearPeriodoCarrera(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/periodo-carrera`, data, { headers: this.headers() });
  }

  // ---------- PARALELOS ----------
  listarParalelos(periodoCarreraId?: string): Observable<any> {
    const url = periodoCarreraId
      ? `${this.apiUrl}/paralelos?periodoCarreraId=${periodoCarreraId}`
      : `${this.apiUrl}/paralelos`;
    return this.http.get(url, { headers: this.headers() });
  }
  crearParalelo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/paralelos`, data, { headers: this.headers() });
  }

  // ---------- ASIGNATURA-PARALELO ----------
  listarAsignaturaParalelo(paraleloId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignatura-paralelo?paraleloId=${paraleloId}`, { headers: this.headers() });
  }
  agregarAsignaturaAParalelo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignatura-paralelo`, data, { headers: this.headers() });
  }
}