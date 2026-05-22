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
  @Input() contactBars: any[] = [
    { date: new Date(Date.now() - 6*86400000), value: 2 },
    { date: new Date(Date.now() - 5*86400000), value: 4 },
    { date: new Date(Date.now() - 4*86400000), value: 6 },
    { date: new Date(Date.now() - 3*86400000), value: 3 },
    { date: new Date(Date.now() - 2*86400000), value: 5 },
    { date: new Date(Date.now() - 86400000), value: 7 },
    { date: new Date(), value: 6 },
  ];
  @Input() visitBars: any[] = [];
  @Input() totalViews = 1240;
  @Input() uniqueVisitors = 820;
  @Input() publishedPosts = 42;
  @Input() draftPosts = 7;
  @Input() topPosts: any[] = [
    { _id: '1', title: 'How to write clean code', slug: 'clean-code', viewCount: 420 },
    { _id: '2', title: 'Angular best practices', slug: 'angular-best', viewCount: 312 },
  ];

  get publishedPercent(){ const t = this.publishedPosts + this.draftPosts || 1; return Math.round(this.publishedPosts / t * 100); }
  get draftPercent(){ return 100 - this.publishedPercent; }

  trackByDate(index: number, item: any){ return item.date?.toString() || index; }
  trackById(index: number, item: any){ return item._id ?? index; }

  contactBarHeight(v: number){ return (v * 8) + 'px'; }
  visitBarHeight(v: number){ return Math.min(140, v) + 'px'; }

  ngOnInit(){
    this.visitBars = this.contactBars.map(b => ({ date: b.date, value: b.value * 12 }));
  }
}
