import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('⚡ authGuard invoked, loggedIn=', auth.isLoggedIn());

  return auth.isLoggedIn()
    ? true
    : router.parseUrl('/login');
};
