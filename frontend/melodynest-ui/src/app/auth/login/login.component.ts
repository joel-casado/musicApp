import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }    from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Email</label>
      <input formControlName="email" type="email" />
      <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
        <small *ngIf="form.get('email')?.errors?.['required']">Requerido.</small>
        <small *ngIf="form.get('email')?.errors?.['email']">Email inválido.</small>
      </div>

      <label>Contraseña</label>
      <input formControlName="password" type="password" />
      <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
        <small>Requerido.</small>
      </div>

      <button type="submit">Entrar</button>
    </form>
    <div *ngIf="error" class="error">{{ error }}</div>
  `
})
export class LoginComponent {
  form!: FormGroup;        // 1) Declaras el campo
  error: string | null = null;

  constructor(
    private fb: FormBuilder,   // 2) Inyectas el FormBuilder
    private auth: AuthService,
    private router: Router
  ) {
    // 3) Aquí sí puedes usar fb porque ya está inicializado
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: ()   => this.router.navigate(['/dashboard']),
      error: err => this.error = err.error?.message || 'Error de login'
    });
  }
}
