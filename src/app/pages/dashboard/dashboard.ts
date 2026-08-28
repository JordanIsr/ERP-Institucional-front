import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Acceso { titulo: string; descripcion: string; ruta: string; icono: string; }

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './dashboard.html', styleUrl: './dashboard.scss' })
export class Dashboard {
  readonly nombre = localStorage.getItem('user_nombre') ?? 'Usuario';
  readonly rol = localStorage.getItem('user_role') ?? 'usuario';

  get mensaje(): string {
    return ({
      admin: 'Configura la estructura académica y administra las cuentas institucionales.',
      secretaria: 'Gestiona estudiantes, matrículas, documentos y correcciones académicas.',
      docente: 'Consulta tus asignaturas y registra las calificaciones de tus estudiantes.',
      estudiante: 'Consulta tu historial y gestiona tu solicitud de matrícula.',
      usuario: 'Tu registro fue recibido. Un administrador debe asignarte el rol correspondiente para habilitar los módulos.',
    } as Record<string, string>)[this.rol] ?? '';
  }

  get accesos(): Acceso[] {
    const mapa: Record<string, Acceso[]> = {
      admin: [
        { titulo: 'Catálogos base', descripcion: 'Administra docentes activos e inactivos para las asignaturas.', ruta: '/catalogos-base', icono: '👨‍🏫' },
        { titulo: 'Mallas curriculares', descripcion: 'Administra mallas, carreras, niveles, asignaturas y docentes en una sola pantalla.', ruta: '/mallas', icono: '🧩' },
        { titulo: 'Usuarios', descripcion: 'Autoriza cuentas y asigna roles.', ruta: '/users', icono: '👥' },
        { titulo: 'Buscar estudiantes', descripcion: 'Consulta expedientes y matrículas.', ruta: '/matriculas/buscar-estudiantes', icono: '🔎' },
      ],
      secretaria: [
        { titulo: 'Matricular estudiante', descripcion: 'Registra estudiantes nuevos en ofertas con cupos.', ruta: '/matriculas/registrar', icono: '📝' },
        { titulo: 'Solicitudes pendientes', descripcion: 'Revisa documentos y aprueba matrículas.', ruta: '/matriculas/solicitudes', icono: '📄' },
        { titulo: 'Corregir calificaciones', descripcion: 'Corrige errores con motivo y auditoría.', ruta: '/corregir-notas', icono: '✏️' },
      ],
      docente: [
        { titulo: 'Registro de notas', descripcion: 'Ingresa NP1, NP2 y recuperación.', ruta: '/registrar-notas', icono: '✅' },
      ],
      estudiante: [
        { titulo: 'Solicitud de matrícula', descripcion: 'Consulta tus opciones y presenta los documentos.', ruta: '/matriculas/solicitud', icono: '📝' },
        { titulo: 'Historial académico', descripcion: 'Consulta tus notas y matrículas.', ruta: '/historial-academico', icono: '🎓' },
      ],
      usuario: [],
    };
    return mapa[this.rol] ?? [];
  }
}
