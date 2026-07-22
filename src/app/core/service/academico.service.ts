import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // ---- Asignaturas ----
  crearAsignatura(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignaturas`, datos);
  }

  listarAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignaturas`);
  }

  // ---- Notas / Historial ----
  registrarNota(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/historial`, datos);
  }

  historialPorEstudiante(estudianteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial/${estudianteId}`);
  }

  miHistorial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial/mio`);
  }

  // ---- Comprobantes de pago ----
subirComprobante(estudianteId: string, archivo: File): Observable<any> {
  const formData = new FormData();
  formData.append('archivo', archivo);
  return this.http.post(`${this.apiUrl}/comprobantes/${estudianteId}`, formData);
}

listarComprobantesPendientes(): Observable<any> {
  return this.http.get(`${this.apiUrl}/comprobantes/pendientes`);
}

  comprobantesPorEstudiante(estudianteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/comprobantes/${estudianteId}`);
  }

  aprobarComprobante(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/comprobantes/${id}/aprobar`, {});
  }

  rechazarComprobante(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/comprobantes/${id}/rechazar`, {});
  }
}