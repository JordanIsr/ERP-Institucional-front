import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { authGuard } from './core/guards/auth.guard';
import { Users } from './pages/users/users';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  // 1. Redirigir la ruta raíz por defecto al login (o al dashboard, si el guard lo permite)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Ruta pública
  { path: 'login', component: Login },

  // 3. Ruta protegida (El 'Home' de tu ERP)
  {path: 'register', component: Register},

  { 
    path: 'dashboard', 
    component: Dashboard 
    // Más adelante aquí agregarás: canActivate: [tuAuthGuard] para verificar el JWT
  },

  {
    path: 'users',
    component: Users
  },

  {
    path: 'settings',
    component: Settings
  }

];
