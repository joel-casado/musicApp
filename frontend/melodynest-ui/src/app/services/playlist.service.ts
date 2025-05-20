// src/app/services/playlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getSongs() {
    return firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/songs`));
  }

  createPlaylist(data: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/playlists`, data));
  }
  
  getPlaylistById(id: string) {
  return this.http.get<any>(`http://localhost:5000/api/playlists/${id}`);
  }

}
