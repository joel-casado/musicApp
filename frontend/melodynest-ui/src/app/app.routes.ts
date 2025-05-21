// src/app/app.routes.ts
import { Route } from '@angular/router';
import { LoginComponent }            from './auth/login/login.component';
import { DashboardComponent }        from './dashboard/dashboard.component';
import { CreatePlaylistComponent }   from './pages/create-playlist/create-playlist.component';
import { authGuard }                 from './auth/auth.guard';
import { CreateUserComponent }       from './create-user/create-user.component';
import { CreateSongComponent }       from './pages/create-song/create-song.component';
import { LibraryComponent }          from './biblioteca/library.component';
import { PlaylistPageComponent }     from './pages/playlist-page/playlist-page.component';
import { BuscarComponent }           from './buscar/buscar.component';
import { ForgotPasswordComponent } from './auth/login/forgot-password.component';

export const Routes: Route[] = [
  // raíz a login
  { path: '',      redirectTo: 'login', pathMatch: 'full' },

  // login libre
  { path: 'login',  component: LoginComponent },
  { path: 'create-user', component: CreateUserComponent },

  // rutas protegidas
  { path: 'dashboard',     component: DashboardComponent,     canActivate: [ authGuard ] },
  { path: 'playlist/new',  component: CreatePlaylistComponent, canActivate: [ authGuard ] },
  // crear cancion
  { path: 'song/new', component: CreateSongComponent, canActivate: [ authGuard ] },
  { path: 'biblioteca', component: LibraryComponent, canActivate: [ authGuard ] },
  {path: 'playlist/:id', component: PlaylistPageComponent, canActivate: [ authGuard ]},
  { path: 'buscar', component: BuscarComponent, canActivate: [ authGuard ] },
  { path: 'playlist/:id/edit', component: CreatePlaylistComponent, canActivate: [authGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent },
{ path: 'playlist/:id/edit', component: CreatePlaylistComponent },
  // wildcard al login
  { path: '**', redirectTo: 'login' }
  
];
