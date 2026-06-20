import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private router = inject(Router);
  
  // Aquí simularías el nombre del usuario que vendría codificado en el JWT
  usuarioLogueado: string = 'Administrador Sistema'; 

  logout() {
    // Eliminamos el token de seguridad
    localStorage.removeItem('auth_token');
    // Redirigimos al usuario al login inmediatamente
    this.router.navigate(['/login']);
  }
}