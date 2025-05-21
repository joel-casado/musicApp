import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.message = '';
    this.error = '';
    this.http.post('http://localhost:5001/api/forgot-password', { email: this.email }).subscribe({
      next: () => {
        this.message = '¡Revisa tu correo para restablecer tu contraseña!';
      },
      error: err => {
        this.error = err.error?.message || 'No se pudo enviar el email de recuperación.';
      }
    });
  }
}