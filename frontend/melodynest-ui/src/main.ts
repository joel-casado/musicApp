import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { AppComponent } from './app/app.component';
import { Routes } from './app/app.routes';
import { AuthInterceptor } from './app/auth/auth.interceptor'; // ✅ tu interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor])
    ),
    provideRouter(Routes, withEnabledBlockingInitialNavigation())
  ]
}).catch(err => console.error(err));
