import { Component }     from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService }   from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule       // ← necesario para que routerLink y navegación funcionen
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
