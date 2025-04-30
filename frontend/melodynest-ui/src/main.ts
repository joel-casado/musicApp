import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom }  from '@angular/core';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation
} from '@angular/router';

import { AppComponent }    from './app/app.component';
import { Routes }          from './app/app.routes';
import { AuthInterceptor } from './app/auth/auth.interceptor';
import { AuthGuard }       from './app/auth/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(Routes, withEnabledBlockingInitialNavigation()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
}).catch(err => console.error(err));
