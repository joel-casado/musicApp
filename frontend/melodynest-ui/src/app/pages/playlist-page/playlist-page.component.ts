import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.css']
})
export class PlaylistPageComponent implements OnInit, AfterViewInit {
  playlist: any = null;
  currentSong: any = null;
  isPlaying: boolean = false;
  currentSongUrl: string | null = null;
  intervalId: any = null;
  progress: number = 0;
  volume: number = 0.8; // Default volume (80%)

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

    constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService // <-- inject AuthService
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

  ngAfterViewInit(): void {
    // Set initial volume when audio element is available
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.volume = this.volume;
    }
  }

  playSong(song: any): void {
    // Guard: wait for audioPlayer to be available
    if (!this.audioPlayer || !this.audioPlayer.nativeElement) return;

    if (this.currentSongUrl === song.url) {
      this.togglePlayPause();
      return;
    }

    this.currentSong = song;
    this.currentSongUrl = song.url;
    this.audioPlayer.nativeElement.src = song.url;
    this.audioPlayer.nativeElement.load(); // Ensure the new source is loaded
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
    this.cdr.detectChanges(); // <-- Fix ExpressionChanged error
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

  getSongDuration(song: any, current: boolean = false): string {
    let totalSeconds = current ? this.audioPlayer?.nativeElement.currentTime || 0 : song.duration;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
  }

  trackProgress(): void {
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const player = this.audioPlayer.nativeElement;
      if (player.duration) {
        this.progress = (player.currentTime / player.duration) * 100;
      } else {
        this.progress = 0;
      }

      if (player.ended) {
        if (this.hasNext()) {
          this.playNext();
        } else {
          this.stopSong();
        }
      }
    }, 500);
  }

  hasNext(): boolean {
    if (!this.playlist || !this.playlist.songs || !this.currentSong) return false;
    const idx = this.playlist.songs.findIndex((s: any) => s.url === this.currentSong.url);
    return idx < this.playlist.songs.length - 1;
  }

  hasPrevious(): boolean {
    if (!this.playlist || !this.playlist.songs || !this.currentSong) return false;
    const idx = this.playlist.songs.findIndex((s: any) => s.url === this.currentSong.url);
    return idx > 0;
  }

  playNext(): void {
    if (!this.hasNext()) return;
    const idx = this.playlist.songs.findIndex((s: any) => s.url === this.currentSong.url);
    const nextSong = this.playlist.songs[idx + 1];
    if (nextSong) {
      this.playSong(nextSong);
    }
  }

  playPrevious(): void {
    if (!this.hasPrevious()) return;
    const idx = this.playlist.songs.findIndex((s: any) => s.url === this.currentSong.url);
    const prevSong = this.playlist.songs[idx - 1];
    if (prevSong) {
      this.playSong(prevSong);
    }
  }

  setVolume(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.volume = value;
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.volume = value;
    }
  }

  seekTo(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.currentTime = value;
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  isOwner(): boolean {
    const userId = this.auth.getUserId?.();
    // Debug log:
    console.log('userId:', userId, 'playlist.owner:', this.playlist?.owner);
    if (!userId || !this.playlist?.owner) return false;
    // Handle both cases: owner as object or string
    if (typeof this.playlist.owner === 'object') {
      return this.playlist.owner._id === userId;
    }
    return this.playlist.owner === userId;
  }

  goToEditPlaylist() {
    this.router.navigate(['/playlist', this.playlist._id, 'edit']);
  }
}
