import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Aula {
  id: string;
  nombre: string;
  capacidadMaxima: number;
}

export interface ParaleloPayload {
  periodoCarreraId: string;
  nivelId: string;
  nombre: string;
  cupoMaximo: number;
  aulaId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParalelosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Ajusta la URL de tu backend NestJS

  // Llama al AulaController de NestJS
  listarAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas`);
  }

  // Llama al ParaleloController de NestJS
  guardarParalelo(payload: ParaleloPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/paralelos`, payload);
  }
}
