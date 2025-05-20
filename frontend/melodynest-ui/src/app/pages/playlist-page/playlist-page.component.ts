import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit {
  playlist: any = null;
  currentSong: any = null;
  isPlaying: boolean = false;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  currentSongUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    const playlistId = this.route.snapshot.paramMap.get('id');
    if (playlistId) {
      this.playlistService.getPlaylistById(playlistId).subscribe({
        next: (data) => {
          this.playlist = data;
        },
        error: (err) => {
          console.error('Error loading playlist:', err);
        }
      });
    }
  }

  playSong(song: any): void {
    if (this.currentSongUrl === song.url) {
      this.audioPlayer.nativeElement.pause();
      this.currentSongUrl = null;
    } else {
      this.currentSongUrl = song.url;
      this.audioPlayer.nativeElement.src = song.url;
      this.audioPlayer.nativeElement.play();
    }
  }

  getSongDuration(song: any): string {
  const totalSeconds = song.duration; // assuming duration is stored as seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
  }


  isSongPlaying(song: any): boolean {
    return this.currentSongUrl === song.url && !this.audioPlayer?.nativeElement.paused;
  }

  
}
