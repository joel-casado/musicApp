import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  imports: [CommonModule]
})
export class LibraryComponent implements OnInit {
  playlists: any[] = [];
  songs: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/playlists').subscribe(res => this.playlists = res as any[]);
    this.http.get('http://localhost:5000/api/songs').subscribe(res => this.songs = res as any[]);
  }
}
