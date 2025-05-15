import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-create-playlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent {
  title = '';
  description = '';
  isPublic = true;
  searchQuery = '';
  image = '';

  dummySongs = [
    { id: '1', title: 'Dreams', artist: 'Fleetwood Mac' },
    { id: '2', title: 'Violet', artist: 'Hole' },
    { id: '3', title: 'Can’t Feel My Face', artist: 'The Weeknd' }
  ];

  selectedSongs: any[] = [];

  addSong(song: any) {
    if (!this.selectedSongs.some(s => s.id === song.id)) {
      this.selectedSongs.push(song);
    }
  }

  removeSong(song: any) {
    this.selectedSongs = this.selectedSongs.filter(s => s.id !== song.id);
  }
}
