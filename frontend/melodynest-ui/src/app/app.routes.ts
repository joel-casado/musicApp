// src/app/app.routes.ts
import { Route } from '@angular/router';
import { LoginComponent }            from './auth/login/login.component';
import { DashboardComponent }        from './dashboard/dashboard.component';
import { CreatePlaylistComponent }   from './pages/create-playlist/create-playlist.component';
import { authGuard }                 from './auth/auth.guard';
import { CreateUserComponent }       from './create-user/create-user.component';

export const Routes: Route[] = [
  // raíz a login
  { path: '',      redirectTo: 'login', pathMatch: 'full' },

  // login libre
  { path: 'login',  component: LoginComponent },
  { path: 'create-user', component: CreateUserComponent },

  // rutas protegidas
  { path: 'dashboard',     component: DashboardComponent,     canActivate: [ authGuard ] },
  { path: 'playlist/new',  component: CreatePlaylistComponent, canActivate: [ authGuard ] },
  

  // wildcard al login
  { path: '**', redirectTo: 'login' },
];
