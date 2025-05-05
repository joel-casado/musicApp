import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  
  // ✅ Declare these at the class level
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

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
        // Optionally reset form
        this.username = '';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong.';
        this.successMessage = '';
      }
    });
  }
  
}
