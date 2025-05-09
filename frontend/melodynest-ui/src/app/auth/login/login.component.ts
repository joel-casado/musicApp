import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }    from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
