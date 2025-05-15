import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Song {
  _id?:    string;
  title:   string;
  artist:  string;
  genre:   string;
  duration:number;
  url:     string;
  image?:  string;
}

@Injectable({ providedIn: 'root' })
export class SongsService {
  private apiUrl = 'http://localhost:5000/api/songs';

  constructor(private http: HttpClient) {}

  create(song: Song): Observable<Song> {
    // enviamos un JSON convencional
    return this.http.post<Song>(this.apiUrl, song);
  }

  list(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }
}
