// src/app/pages/create-playlist/create-playlist.component.ts
import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private playlistService: PlaylistService) {}

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

  async savePlaylist() {
    try {
      const payload = {
        title: this.title,
        description: this.description,
        isPublic: this.isPublic,
        image: this.image,
        songs: this.selectedSongs.map(s => s._id)
      };

      await this.playlistService.createPlaylist(payload);
      alert('🎉 Playlist creada con éxito!');
      // Optionally, navigate or reset form
    } catch (error) {
      console.error('Error guardando playlist:', error);
      alert('🚨 Error al crear la playlist');
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

    // Show only the 3 latest songs (assuming allSongs is sorted oldest->newest)
    return filtered.slice(-3).reverse(); // newest first
  }
}
