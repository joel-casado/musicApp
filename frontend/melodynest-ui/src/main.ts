// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter }          from '@angular/router';

import { AppComponent }           from './app/app.component';
import { Routes }                 from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),  // activa el fetch adapter
    provideRouter(Routes)
  ]
}).catch(err => console.error(err));
