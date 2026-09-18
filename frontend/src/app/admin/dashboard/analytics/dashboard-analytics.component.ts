import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-dashboard-analytics',
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss'],
})
export class DashboardAnalyticsComponent {
  @Input() available = true;
  @Input() contactBars: any[] = [];
  @Input() visitBars: any[] = [];
  @Input() totalViews = 0;
  @Input() uniqueVisitors = 0;
  @Input() publishedPosts = 0;
  @Input() draftPosts = 0;
  @Input() topPosts: any[] = [];

  get publishedPercent(){ const t = this.publishedPosts + this.draftPosts || 1; return Math.round(this.publishedPosts / t * 100); }
  get draftPercent(){ return 100 - this.publishedPercent; }

  trackByDate(index: number, item: any){ return item.date?.toString() || index; }
  trackById(index: number, item: any){ return item._id ?? index; }

  contactBarHeight(v: number){ return (v * 8) + 'px'; }
  visitBarHeight(v: number){ return Math.min(140, v) + 'px'; }
}
