import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService, Biography, TimelineItem } from '@core/services/content.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-biografia',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './biografia.component.html',
    styleUrls: ['./biografia.component.scss'],
})
export class BiografiaComponent implements OnInit, AfterViewChecked, OnDestroy {
  timelineItems: TimelineItem[] = [];
  portraitUrl = 'assets/images/paolo-id.png';
  stats: any[] = [];
  // Timeline display control
  showAllTimeline = false;
  timelinePreviewCount = 3;
  private lastLineHeight = -1;

  @ViewChild('timelineContainer') private timelineContainer?: ElementRef<HTMLElement>;
  @ViewChild('timelineLine') private timelineLine?: ElementRef<HTMLElement>;

  constructor(private contentService: ContentService, private translate: TranslateService) {}

  private langSub: Subscription | null = null;

  ngOnInit() {
    this.contentService.getBiography().subscribe({
      next: (bio: Biography) => {
        this.portraitUrl = bio.portraitUrl;
        if (bio.timelineItems && bio.timelineItems.length) {
          this.timelineItems = bio.timelineItems;
        } else {
          this.buildLocaleFallback();
        }
        this.stats = bio.stats;
      },
      error: (err: any) => {
        console.error('Error loading biography:', err);
        this.buildLocaleFallback();
      },
    });

    // Rebuild fallback when language changes
    this.langSub = this.translate.onLangChange.subscribe(() => {
      // only rebuild if we're using fallback (no server timeline)
      if (!this.timelineItems || this.timelineItems.length === 0) {
        this.buildLocaleFallback();
      } else {
        // also rebuild to update translated strings
        this.buildLocaleFallback();
      }
    });
  }

  get visibleTimelineItems(): TimelineItem[] {
    return this.showAllTimeline ? this.timelineItems : this.timelineItems.slice(0, this.timelinePreviewCount);
  }

  toggleTimeline() {
    this.showAllTimeline = !this.showAllTimeline;
  }

  ngAfterViewChecked(): void {
    this.updateLineHeight();
  }

  private updateLineHeight(): void {
    try {
      if (!this.timelineContainer || !this.timelineLine) return;
      const containerEl = this.timelineContainer.nativeElement as HTMLElement;
      const items = containerEl.querySelectorAll('.timeline-item');
      if (!items || items.length === 0) {
        this.timelineLine.nativeElement.style.height = '0px';
        return;
      }
      const lastItem = items[items.length - 1] as HTMLElement;
      const containerRect = containerEl.getBoundingClientRect();
      const lastRect = lastItem.getBoundingClientRect();
      const height = (lastRect.top + lastRect.height / 2) - containerRect.top;
      const h = Math.max(0, Math.round(height));
      if (this.lastLineHeight !== h) {
        this.timelineLine.nativeElement.style.height = h + 'px';
        this.lastLineHeight = h;
      }
    } catch (err) {
      // silent
    }
  }

  private timelineDefs = [
    { id: 't1', year: '1983' },
    { id: 't2', year: '1989' },
    { id: 't3', year: '1995' },
    { id: 't4', year: '2005' },
    { id: 't5', year: '2015' },
    { id: 't6', year: '2024' },
  ];

  private buildLocaleFallback(): void {
    const keys: string[] = [];
    this.timelineDefs.forEach(d => {
      keys.push(`sections.biografia.timeline.${d.id}.title`);
      keys.push(`sections.biografia.timeline.${d.id}.description`);
    });

    this.translate.get(keys).subscribe((res) => {
      this.timelineItems = this.timelineDefs.map(d => ({
        id: d.id,
        year: d.year,
        title: res[`sections.biografia.timeline.${d.id}.title`] || `sections.biografia.timeline.${d.id}.title`,
        description: res[`sections.biografia.timeline.${d.id}.description`] || '',
      } as TimelineItem));
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
      this.langSub = null;
    }
  }
}

