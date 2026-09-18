import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Video {
  id: number;
  title: string;
  description?: string;
  youtubeUrl: string;
  thumbnail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiUrl, { params: { limit: 12 } });
  }
}
