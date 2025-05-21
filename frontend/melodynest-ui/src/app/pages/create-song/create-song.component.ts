import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SongsService } from '../../songs/songs.service';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-create-song',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './create-song.component.html',
  styleUrls: ['./create-song.component.css']
})
export class CreateSongComponent {
  title    = '';
  artist   = '';
  genre    = '';
  duration = 0;
  image    = '';
  audioFile: File | null = null;
  error    = '';
  isDragOver = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleAudioFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleAudioFile(file);
    }
  }

  private handleAudioFile(file: File) {
    if (file && (file.type === 'audio/mp3' || file.type === 'audio/mpeg')) {
      this.audioFile = file;
      this.error = '';
      // Get duration
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        this.duration = Math.floor(audio.duration);
      };
    } else {
      this.error = 'Por favor selecciona un archivo MP3 válido.';
      this.audioFile = null;
      this.duration = 0;
    }
  }

  onSubmit() {
    if (!this.title.trim() || !this.artist.trim() || !this.audioFile) {
      this.error = 'Título, artista y archivo MP3 son obligatorios';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('artist', this.artist);
    formData.append('genre', this.genre);
    formData.append('duration', this.duration.toString());
    formData.append('image', this.image);
    formData.append('audio', this.audioFile);

    this.http.post('http://localhost:5000/api/songs/upload', formData).subscribe({
      next: () => {
        this.snackBar.open('Canción creada con éxito 🎵', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error?.message || 'No se pudo crear la canción';
        this.snackBar.open('Error al crear la canción ❌', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  goToDashboard() {
  this.router.navigate(['/dashboard']);
  }
}
