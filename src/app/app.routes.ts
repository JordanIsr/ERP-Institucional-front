import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { Layout } from './pages/layout/layout';
import { authGuard } from './core/guards/auth.guard';

import { Users } from './pages/users/users';
import { Settings } from './pages/settings/settings';

import { Matriculas } from './pages/matriculas/matriculas';
import { BuscarEstudiantes } from './pages/matriculas/buscar-estudiantes/buscar-estudiantes';
import { HistorialAcademico } from './pages/historial-academico/historial-academico';

import { GestionAcademica } from './pages/gestion-academica/gestion-academica';
import { ComprobantesPendientes } from './pages/comprobantes-pendientes/comprobantes-pendientes';

import { PeriodosFlujo } from './pages/oferta-academica/periodos-flujo/periodos-flujo';
import { PeriodosComponent } from './pages/periodos/periodos.component';

import { Catalogos } from './pages/catalogos/catalogos';
import { EstructuraCurricular } from './pages/estructura-curricular/estructura-curricular';
import { CrearMalla } from './pages/crear-malla/crear-malla';

import { ParalelosHorarios } from './pages/oferta-academica/paralelos-horarios/paralelos-horarios';

import { SolicitudesMatriculas } from './pages/matriculas/solicitudes-matriculas/solicitudes-matriculas';
import { RevisionSolicitudes } from './pages/matriculas/revision-solicitudes/revision-solicitudes';

import { RegistarNotas } from './pages/registrar-notas/registrar-notas';

import { CarrerasPeriodo } from './pages/oferta-academica/carreras-periodo/carreras-periodo';

import { ConfiguracionAcademica } from './pages/configuracion-academica/configuracion-academica';


export const routes: Routes = [

  // =====================================================
  // RUTA PRINCIPAL
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // =====================================================
  // RUTAS PÚBLICAS
  // =====================================================

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  // =====================================================
  // LAYOUT PRINCIPAL
  // =====================================================

  {
    path: '',
    component: Layout,
    children: [

      // =================================================
      // DASHBOARD
      // =================================================

      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        data: {
          roles: [
            'admin',
            'secretaria',
            'estudiante',
            'docente',
            'usuario'
          ]
        }
      },

      // =================================================
      // USUARIOS
      // =================================================

      {
        path: 'users',
        component: Users,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // COMPROBANTES PENDIENTES
      // =================================================

      {
        path: 'comprobantes-pendientes',
        component: ComprobantesPendientes,
        canActivate: [authGuard],
        data: {
          roles: ['admin', 'secretaria']
        }
      },

      // =================================================
      // MATRÍCULAS
      // =================================================

      {
        path: 'matriculas/registrar',
        component: Matriculas,
        canActivate: [authGuard],
        data: {
          roles: ['secretaria']
        }
      },

      {
        path: 'matriculas/buscar-estudiantes',
        component: BuscarEstudiantes,
        canActivate: [authGuard],
        data: {
          roles: ['admin', 'secretaria', 'docente']
        }
      },

      {
        path: 'matriculas/solicitudes',
        component: RevisionSolicitudes,
        canActivate: [authGuard],
        data: {
          roles: ['admin', 'secretaria']
        }
      },

      {
        path: 'matriculas/solicitud',
        component: SolicitudesMatriculas,
        canActivate: [authGuard],
        data: {
          roles: ['estudiante']
        }
      },

      // =================================================
      // HISTORIAL ACADÉMICO
      // =================================================

      {
        path: 'historial-academico',
        component: HistorialAcademico,
        canActivate: [authGuard],
        data: {
          roles: [
            'admin',
            'secretaria',
            'estudiante',
            'docente'
          ]
        }
      },

      // =================================================
      // GESTIÓN ACADÉMICA
      // =================================================

      {
        path: 'gestion-academica',
        component: GestionAcademica,
        canActivate: [authGuard],
        data: {
          roles: [
            'admin',
            'secretaria',
            'estudiante',
            'docente'
          ]
        }
      },

      // =================================================
      // CONFIGURACIÓN
      // =================================================

      {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard],
        data: {
          roles: [
            'admin',
            'secretaria',
            'estudiante',
            'docente',
            'usuario'
          ]
        }
      },

      // =================================================
      // CONFIGURACIÓN ACADÉMICA
      // =================================================

      {
        path: 'configuracion-academica',
        component: ConfiguracionAcademica,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // PERÍODOS ACADÉMICOS
      // NUEVO MÓDULO
      // =================================================

      {
        path: 'periodos',
        component: PeriodosComponent,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // PERÍODOS - FLUJO EXISTENTE
      // =================================================

      {
        path: 'periodos-flujo',
        component: PeriodosFlujo,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // CARRERAS POR PERÍODO
      // =================================================

      {
        path: 'carreras-periodo',
        component: CarrerasPeriodo,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // ESTRUCTURA CURRICULAR
      // =================================================

      {
        path: 'estructura-curricular',
        component: EstructuraCurricular,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // CREAR MALLA
      // =================================================

      {
        path: 'crear-malla',
        component: CrearMalla,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // PARALELOS Y HORARIOS
      // =================================================

      {
        path: 'paralelos-horarios',
        component: ParalelosHorarios,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      },

      // =================================================
      // REGISTRO DE NOTAS
      // =================================================

      {
        path: 'registrar-notas',
        component: RegistarNotas,
        canActivate: [authGuard],
        data: {
          roles: ['docente']
        }
      },

      // =================================================
      // CATÁLOGOS
      // =================================================

      {
        path: 'catalogos',
        component: Catalogos,
        canActivate: [authGuard],
        data: {
          roles: ['admin']
        }
      }

    ]
  }

];