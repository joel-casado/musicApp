// src/app/pages/create-playlist/create-playlist.component.ts
import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreatePlaylistComponent implements OnInit {
  title = '';
  description = '';
  isPublic = true;
  searchQuery = '';
  image = '';

  allSongs: any[] = [];
  selectedSongs: any[] = [];

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSongs();
  }

  async loadSongs() {
    try {
      this.allSongs = await this.playlistService.getSongs();
    } catch (error) {
      console.error('Error cargando canciones:', error);
    }
  }

  addSong(song: any) {
    if (!this.selectedSongs.some(s => s._id === song._id)) {
      this.selectedSongs.push(song);
    }
  }

  removeSong(song: any) {
    this.selectedSongs = this.selectedSongs.filter(s => s._id !== song._id);
  }

  async savePlaylist(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    try {
      const payload = {
        title: this.title,
        description: this.description,
        isPublic: this.isPublic,
        image: this.image,
        songs: this.selectedSongs.map(s => s._id)
      };

      await this.playlistService.createPlaylist(payload);
      this.snackBar.open('Playlist creada con éxito 🎵', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error guardando playlist:', error);
      this.snackBar.open('Error al crear la playlist ❌', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  get filteredSongs() {
    let filtered = this.allSongs;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
      );
    }

    // Exclude already selected songs
    filtered = filtered.filter(song =>
      !this.selectedSongs.some(sel => sel._id === song._id)
    );

    // Show only the 3 latest (newest first)
    return filtered.slice(-3).reverse();
  }
  goToDashboard() {
  this.router.navigate(['/dashboard']);
  }
}
