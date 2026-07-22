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
import { PeriodosFlujo } from './pages/periodos-flujo/periodos-flujo';

export const routes: Routes = [
  // 1. Redirigir la ruta raíz por defecto al login (o al dashboard, si el guard lo permite)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Ruta pública
  { path: 'login', component: Login },

  // 3. Ruta protegida (El 'Home' de tu ERP)
  {path: 'register', component: Register},

  {path: '', component: Layout,children: [

  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard],
    data: { roles: ['admin', 'secretaria', 'estudiante', 'docente', 'usuario'] }
    // Más adelante aquí agregarás: canActivate: [tuAuthGuard] para verificar el JWT
  },

  {
  path: 'users',
  component: Users,
  canActivate: [authGuard],
  data: { roles: ['admin'] }
},

{
  path: 'comprobantes-pendientes',
  component: ComprobantesPendientes,
  canActivate: [authGuard],
  data: { roles: ['admin'] }
},

{
  path: 'matriculas/registrar',//Matriculas/registrar es la ruta de todo mi modulo de matriculas/matriculas
  component: Matriculas,
  canActivate: [authGuard],
  data: { roles: ['secretaria'] }
},
{
  path: 'matriculas/buscar-estudiantes',
  component: BuscarEstudiantes,
  canActivate: [authGuard],
  data: { roles: ['admin', 'secretaria', 'docente'] }
},
{
  path: 'historial-academico',
  component: HistorialAcademico,
  canActivate: [authGuard],
  data: { roles: ['admin', 'secretaria', 'estudiante', 'docente'] }
},

{
  path: 'gestion-academica',
  component: GestionAcademica,
  canActivate: [authGuard],
  data: { roles: ['admin', 'secretaria', 'estudiante', 'docente'] }
},

{
  path: 'settings',
  component: Settings,
  canActivate: [authGuard],
  data: { roles: ['admin', 'secretaria', 'estudiante', 'docente', 'usuario'] }
},

{
  path: 'periodos-flujo',
  component: PeriodosFlujo,
  canActivate: [authGuard],
  data: { roles: ['admin'] },
},

  ]

 }

];
