import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }    from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatSnackBarModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
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
   ngOnInit() {
    const userCreated = localStorage.getItem('userCreated');
    if (userCreated) {
      this.snackBar.open('Usuario creado correctamente 🎉', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      localStorage.removeItem('userCreated');
    }
  }

}
