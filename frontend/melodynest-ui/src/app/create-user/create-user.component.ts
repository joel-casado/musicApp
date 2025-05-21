import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar) {}

  createUser() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:5000/api/users', userData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'User created successfully!';
        this.errorMessage = '';
        localStorage.setItem('userCreated', 'true');
        this.router.navigate(['/login']);
        this.username = '';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        this.snackBar.open('Error al crear el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}
