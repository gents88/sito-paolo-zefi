import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService } from '@core/services/content.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lezha',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './lezha.component.html',
  styleUrls: ['./lezha.component.scss'],
})
export class LezhaComponent implements OnInit, OnDestroy {
  stories: any[] = [];
  timelinePoints: Array<{ year: string; label: string }> = [];
  fallbackStoriesList: any[] = [];
  private langSub: Subscription | null = null;

  constructor(private contentService: ContentService, private translate: TranslateService, private router: Router) {}

  ngOnInit() {
    this.contentService.getStories().subscribe({
      next: (stories) => (this.stories = stories),
      error: (err) => console.error('Error loading stories:', err),
    });

    // Try to load medieval timeline from backend, fallback to localized static data
    this.contentService.getTimeline().subscribe({
      next: (items) => {
        if (items && items.length) {
          this.timelinePoints = items.map((it: any) => ({ year: it.year, label: it.title || it.label || it.name }));
        } else {
          this.buildLocaleFallback();
        }
      },
      error: (err) => {
        console.error('Error loading medieval timeline:', err);
        this.buildLocaleFallback();
      }
    });

    // rebuild when language changes
    this.langSub = this.translate.onLangChange.subscribe(() => this.buildLocaleFallback());
  }

  openOrDownload(story: any) {
    if (!story) return;
    // If an explicit article URL is provided, open it in a new tab
    if (story.articleUrl) {
      window.open(story.articleUrl, '_blank');
      return;
    }

    // If an explicit download URL is provided, open it
    if (story.downloadUrl) {
      window.open(story.downloadUrl, '_blank');
      return;
    }

    // Fallback: navigate to a content page with the story id
    try {
      this.router.navigate(['/content', story.id]);
    } catch (err) {
      console.warn('Navigation failed, opening content in same tab as fallback', err);
      window.open(`/content/${story.id}`, '_self');
    }
  }

  readArticle(story: any) {
    if (!story) return;
    if (story.articleUrl) {
      window.open(story.articleUrl, '_blank');
      return;
    }
    // fallback to internal content page
    try {
      this.router.navigate(['/content', story.id]);
    } catch (err) {
      window.open(`/content/${story.id}`, '_self');
    }
  }

  downloadArticle(story: any) {
    if (!story) return;
    if (story.downloadUrl) {
      // open direct download
      window.open(story.downloadUrl, '_blank');
      return;
    }
    // if no download url, but article exists, open article so user can save/print
    if (story.articleUrl) {
      window.open(story.articleUrl, '_blank');
      return;
    }
    // fallback: attempt to open a download endpoint
    try {
      window.open(`${window.location.origin}/content/${story.id}/download`, '_blank');
    } catch (err) {
      console.warn('Download fallback failed', err);
    }
  }

  private buildLocaleFallback() {
    const keys: string[] = [];
    this.timelineDefs.forEach(d => keys.push(`sections.lezha.timeline.${d.id}.label`));
    this.storyDefs.forEach(d => {
      keys.push(`sections.lezha.stories.${d.id}.title`);
      keys.push(`sections.lezha.stories.${d.id}.description`);
    });

    this.translate.get(keys).subscribe(res => {
      this.timelinePoints = this.timelineDefs.map(d => ({ year: d.year, label: res[`sections.lezha.timeline.${d.id}.label`] || '' }));
      this.fallbackStoriesList = this.storyDefs.map((d, i) => ({ id: i + 1, icon: d.icon, era: d.era, title: res[`sections.lezha.stories.${d.id}.title`] || '', description: res[`sections.lezha.stories.${d.id}.description`] || '' }));
    });
  }

  // Fallback data
  // Definitions for fallback stories and timeline; localized text comes from i18n JSON
  private storyDefs = [
    { id: 's1', icon: 'fa-solid fa-fort-awesome', era: 'III sec. a.C.' },
    { id: 's2', icon: 'fa-solid fa-chess-rook', era: '1393' },
    { id: 's3', icon: 'fa-solid fa-khanda', era: '2 Marzo 1444' },
    { id: 's4', icon: 'fa-solid fa-shield-halved', era: '1444-1468' },
    { id: 's5', icon: 'fa-solid fa-cross', era: '17 Gennaio 1468' },
    { id: 's6', icon: 'fa-solid fa-mountain-sun', era: 'Oggi' }
  ];

  private timelineDefs = [
    { id: 't1', year: '385 a.C.' },
    { id: 't2', year: '1393' },
    { id: 't3', year: '1444' },
    { id: 't4', year: '1468' },
    { id: 't5', year: '1912' }
  ];

  // Expose localized fallback data
  get fallbackStories() {
    return this.fallbackStoriesList;
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
      this.langSub = null;
    }
  }
}
