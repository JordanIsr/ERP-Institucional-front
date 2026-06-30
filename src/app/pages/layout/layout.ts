import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterOutlet, RouterLink, RouterLinkActive], // Importamos las herramientas de ruteo
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'] // (Copia aquí tu CSS del layout si lo tenías en app.scss)
})
export class Layout {
  usuarioLogueado: string = 'Administrador'; 

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }
}