// src/app/app.routes.ts
import { Route } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatePlaylistComponent } from './pages/create-playlist/create-playlist.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateUserComponent } from './create-user/create-user.component';

export const Routes: Route[] = [
  // ✅ Default route: root goes to create-user
  { path: '', redirectTo: 'create-user', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // 🟢 Publicly accessible dashboard
  { path: 'dashboard', component: DashboardComponent },

  { path: 'create-user', component: CreateUserComponent },
  
  { path: 'playlist/new', component: CreatePlaylistComponent },
  // ✅ Wildcard last: unknown routes go to login
  { path: '**', redirectTo: 'login' },
  

];
