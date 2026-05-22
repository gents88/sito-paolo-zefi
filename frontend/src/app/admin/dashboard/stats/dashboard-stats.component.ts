import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-dashboard-stats',
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss'],
})
export class DashboardStatsComponent {
  @Input() stats: any[] = [
    { labelKey: 'admin.cards.articles', value: 12, miniBars: [20,40,60,30], icon: 'article', color: '#6366f1', route: ['/admin','articles'] },
    { labelKey: 'admin.cards.books', value: 4, miniBars: [10,30,20], icon: 'book', color: '#f59e0b', route: ['/admin','books'] },
    { labelKey: 'admin.cards.videos', value: 8, miniBars: [5,15,25], icon: 'ondemand_video', color: '#10b981', route: ['/admin','videos'] },
  ];

  trackByLabel(index: number, item: any){ return item.labelKey; }
}
