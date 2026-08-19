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
  data: { roles: ['admin', 'secretaria'] }
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
  path: 'matriculas/solicitudes',
  component: RevisionSolicitudes,
  canActivate: [authGuard],
  data: { roles: ['admin', 'secretaria'] }
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
  path: 'configuracion-academica',
  component: ConfiguracionAcademica,
  canActivate: [authGuard],
  data: { roles: ['admin'] }
},

{
  path: 'periodos-flujo',
  component: PeriodosFlujo,
  canActivate: [authGuard],
  data: { roles: ['admin'] }
},

{
  path: 'carreras-periodo',
  component: CarrerasPeriodo,
  canActivate: [authGuard],
  data: { roles: ['admin'] }
},

{
  path: 'estructura-curricular',
  component: EstructuraCurricular,
  canActivate: [authGuard],
  data: {roles: ['admin']}
},

{
  path: 'crear-malla',
  component: CrearMalla,
  canActivate:[authGuard],
  data: {roles:['admin']}
},

{
  path: 'paralelos-horarios',
  component: ParalelosHorarios,
  canActivate: [authGuard],
  data: {roles:['admin']}
},

{
  path: 'registrar-notas',
  component: RegistarNotas,
  canActivate: [authGuard],
  data: {roles:['docente']}
},

{ path: 'catalogos',
  component: Catalogos, 
  canActivate: [authGuard], 
  data: {roles: ['admin']}
},

{
  path: 'matriculas/solicitud',
  component: SolicitudesMatriculas,
  canActivate: [authGuard],
  data: {roles: ['estudiante'],}
},

  ]

 }

];
