import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // 🚧 Esta URL cambiará a la de tu NestJS cuando lo levantes (ej. http://localhost:3000/auth/login)
  private apiUrl = 'http://localhost:3000/api/auth'; 

  login(credentials: any) {
    // Hacemos el POST a NestJS
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si NestJS devuelve un token, Angular lo guarda automáticamente
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  // Método para cuando hagas el registro
  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }
}