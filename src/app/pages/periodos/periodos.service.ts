import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeriodosService {

  private http =
    inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/api/periodos';

  obtenerPeriodos(): Observable<any> {
    return this.http.get(
      this.apiUrl,
    );
  }

  crearPeriodo(
    datos: any,
  ): Observable<any> {
    return this.http.post(
      this.apiUrl,
      datos,
    );
  }

  cambiarEstado(
    id: string,
    activo: boolean,
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/${id}`,
      {
        activo,
      },
    );
  }

  eliminarPeriodo(
    id: string,
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
    );
  }
}