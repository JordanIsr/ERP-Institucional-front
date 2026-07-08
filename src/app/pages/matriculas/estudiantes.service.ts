import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/estudiantes'; 

  // ✅ Asegúrate de que este nombre esté bien escrito:
  matricularEstudiante(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

  obtenerEstudiantes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  actualizarEstudiante(id: string, datos: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, datos);
  }

  eliminarEstudiante(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}