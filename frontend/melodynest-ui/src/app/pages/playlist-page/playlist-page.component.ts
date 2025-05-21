import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
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
  currentSongUrl: string | null = null;
  intervalId: any = null;
  progress: number = 0;

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

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
      this.togglePlayPause();
      return;
    }

    this.currentSong = song;
    this.currentSongUrl = song.url;
    this.audioPlayer.nativeElement.src = song.url;
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;

    this.trackProgress();
  }

  togglePlayPause(): void {
    if (!this.audioPlayer?.nativeElement) return;

    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();
    } else {
      this.audioPlayer.nativeElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  stopSong(): void {
    this.audioPlayer.nativeElement.pause();
    this.audioPlayer.nativeElement.currentTime = 0;
    this.currentSongUrl = null;
    this.currentSong = null;
    this.isPlaying = false;
    this.progress = 0;
    clearInterval(this.intervalId);
  }

  isSongPlaying(song: any): boolean {
    return (
      this.currentSongUrl === song.url &&
      !this.audioPlayer?.nativeElement.paused
    );
  }

  getSongDuration(song: any): string {
    const totalSeconds = song.duration; // stored in seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
  }

  trackProgress(): void {
    clearInterval(this.intervalId); // avoid duplicates

    this.intervalId = setInterval(() => {
      const player = this.audioPlayer.nativeElement;
      if (player.duration) {
        this.progress = (player.currentTime / player.duration) * 100;
      } else {
        this.progress = 0;
      }

      if (player.ended) {
        this.stopSong();
      }
    }, 500);
  }
}
