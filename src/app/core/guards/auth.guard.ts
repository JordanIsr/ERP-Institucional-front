import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Revisamos si el JWT existe en el almacenamiento local
  const token = localStorage.getItem('auth_token');

  if (token) {
    // Si hay token, permitimos el paso a la ruta protegida
    return true;
  } else {
    // Si no hay token, lo mandamos directo al login
    router.navigate(['/login']);
    return false;
  }
};