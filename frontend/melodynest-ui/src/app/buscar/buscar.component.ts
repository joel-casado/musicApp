import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscar',
  standalone: true,
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BuscarComponent implements OnInit {
  playlists: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/playlists/public').subscribe(res => this.playlists = res as any[]);
  }

  get filteredPlaylists() {
    if (!this.searchQuery.trim()) return this.playlists;
    const q = this.searchQuery.trim().toLowerCase();
    return this.playlists.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  goToPlaylist(id: string) {
    this.router.navigate(['/playlist', id]);
  }
  goToDashboard() {
  this.router.navigate(['/dashboard']);
  }
}