import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  songs: any[] = [];
  playlists: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/songs/user?limit=5').subscribe({
      next: (res: any) => {
        console.log('[Dashboard] canciones recibidas →', res);
        this.songs = res;
      },
      error: err => {
        console.error('Error al cargar canciones', err);
      }
    });

    this.http.get('http://localhost:5000/api/playlists/user?limit=5').subscribe({
      next: (res: any) => {
        this.playlists = res;
      },
      error: err => {
        console.error('Error al cargar playlists', err);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  openLink(url: string) {
    window.open(url, '_blank');
  }
  goToPlaylist(id: string) {
    this.router.navigate(['/playlist', id]);
  }

}
