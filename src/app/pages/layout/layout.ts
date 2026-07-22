import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout {
  usuarioLogueado: string = localStorage.getItem('user_nombre') ?? 'Usuario';
  rolUsuario: string = localStorage.getItem('user_role') ?? '';
  matriculasAbierto = false;

  constructor(private router: Router) {}

  esAdmin(): boolean {
    return this.rolUsuario === 'admin';
  }

  esAdminOSecretariaOEstudianteOUsuario(): boolean {
    return this.rolUsuario === 'admin' || this.rolUsuario === 'secretaria' || this.rolUsuario === 'estudiante' || this.rolUsuario === 'usuario';
  }

   esSecretaria(): boolean {
    return this.rolUsuario === 'secretaria';
  }

   esSecretariaODocenteOEstudiante(): boolean {
    return this.rolUsuario === 'secretaria' || this.rolUsuario === 'docente' || this.rolUsuario === 'estudiante' ;
  }

  esAdminOSecretaria(): boolean {
    return this.rolUsuario === 'admin' || this.rolUsuario === 'secretaria';
  }

  esAdminOSecretariaOEstudiante(): boolean {
    return this.rolUsuario === 'admin' || this.rolUsuario === 'secretaria' || this.rolUsuario === 'estudiante';
  }

  toggleMatriculas() {
    this.matriculasAbierto = !this.matriculasAbierto;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_nombre');
    this.router.navigate(['/login']);
  }
}