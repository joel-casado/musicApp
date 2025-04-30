// src/app/app.routes.ts
import { Route } from '@angular/router';
import { LoginComponent }     from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard }          from './auth/auth.guard';

export const Routes: Route[] = [
  // Redirige la raíz a /login
  { path: '',           redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',      component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // Cualquier otra ruta de un “page not found” vuelve a login
  { path: '**',         redirectTo: 'login' }
];
