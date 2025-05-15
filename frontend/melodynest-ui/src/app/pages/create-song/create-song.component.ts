import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Update the path below to the correct relative path where songs.service.ts exists
import { SongsService, Song } from '../../songs/songs.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-create-song',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-song.component.html',
  styleUrls: ['./create-song.component.css']
})
export class CreateSongComponent {
  title    = '';
  artist   = '';
  genre    = '';
  duration = 0;
  url      = '';
  image     = '';
  error    = '';

  constructor(
    private songsService: SongsService,
    private router: Router
  ) {}


  onSubmit() {
    // chequeos mínimos
    if (!this.title.trim() || !this.artist.trim() || !this.url.trim()) {
      this.error = 'Title, artist y URL son obligatorios';
      return;
    }

    const newSong: Song = {
      title:    this.title,
      artist:   this.artist,
      genre:    this.genre,
      duration: this.duration,
      url:      this.url,
      image:    this.image    // incluimos aquí la URL de la imagen
    };


    this.songsService.create(newSong).subscribe({
      next: song => {
        console.log('Canción creada:', song);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error(err);
        this.error = err.error?.message || 'No se pudo crear la canción';
      }
    });
  }
}
