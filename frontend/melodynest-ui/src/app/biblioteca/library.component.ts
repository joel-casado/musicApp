import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LibraryComponent implements OnInit {
  playlists: any[] = [];
  songs: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/playlists/user').subscribe(res => this.playlists = res as any[]);
    this.http.get('http://localhost:5000/api/songs/user').subscribe(res => this.songs = res as any[]);
  }

  get filteredPlaylists() {
    if (!this.searchQuery.trim()) return this.playlists;
    const q = this.searchQuery.trim().toLowerCase();
    return this.playlists.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  get filteredSongs() {
    if (!this.searchQuery.trim()) return this.songs;
    const q = this.searchQuery.trim().toLowerCase();
    return this.songs.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.artist?.toLowerCase().includes(q)
    );
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToPlaylist(id: string) {
    this.router.navigate(['/playlist', id]);
  }
}
