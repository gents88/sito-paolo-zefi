import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { VideoService } from '@core/services/video.service';

interface VideoCard {
  title: string;
  description: string;
  embedUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  videos: VideoCard[] = [];

  private fallbackVideos = [
    { title: 'Skanderbeg e la Lega di Alessio', description: "Un viaggio nelle origini dell'unità albanese, dalla fortezza di Lezha alle pianure dove si combatté la resistenza ottomana.", youtubeUrl: 'https://www.youtube.com/embed/o3FuyrAlf3E?rel=0' },
    { title: 'Il Castello di Lezha', description: 'Paulin Zefi racconta la storia millenaria della fortezza che domina la città.', youtubeUrl: 'https://www.youtube.com/embed/EngW7tLk6R8?rel=0' },
    { title: 'Il Memoriale di San Nicola', description: 'Storia della chiesa di San Nicola e del sepolcro di Gjergj Kastrioti Skanderbeg.', youtubeUrl: 'https://www.youtube.com/embed/Lzd3-WJfCwc?rel=0' },
  ];

  constructor(private videoService: VideoService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.videoService.getVideos().subscribe({
      next: (videos) => {
        if (videos && videos.length) {
          this.videos = videos.map((v) => ({
            title: v.title,
            description: v.description || '',
            embedUrl: this.toEmbedUrl(v.youtubeUrl),
          }));
        } else {
          this.useFallback();
        }
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.useFallback();
      },
    });
  }

  private useFallback(): void {
    this.videos = this.fallbackVideos.map((v) => ({
      title: v.title,
      description: v.description,
      embedUrl: this.toEmbedUrl(v.youtubeUrl),
    }));
  }

  private toEmbedUrl(url: string): SafeResourceUrl {
    let embed = url;
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    const videoId = watchMatch?.[1] || shortMatch?.[1];
    if (videoId) {
      embed = `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }
}
