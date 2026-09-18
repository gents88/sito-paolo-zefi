import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { DashboardStatsComponent } from '../stats/dashboard-stats.component';
import { DashboardAnalyticsComponent } from '../analytics/dashboard-analytics.component';
import { DashboardContactsComponent } from '../contacts/dashboard-contacts.component';
import { DashboardChatComponent } from '../chat/dashboard-chat.component';
import { DashboardUtilityComponent } from '../utility/dashboard-utility.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-main',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    DashboardStatsComponent,
    DashboardAnalyticsComponent,
    DashboardContactsComponent,
    DashboardChatComponent,
    DashboardUtilityComponent,
  ],
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent implements OnInit {
  loading = false;
  actionMessageKey = '';
  lastLoadedAt: Date | null = null;

  // Stats (real, from /stats)
  stats: any[] = [
    { labelKey: 'admin.cards.articles', value: 0, miniBars: [], icon: 'article', color: '#6366f1', route: ['/admin', 'articles'] },
    { labelKey: 'admin.cards.books', value: 0, miniBars: [], icon: 'book', color: '#f59e0b', route: ['/admin', 'books'] },
    { labelKey: 'admin.cards.videos', value: 0, miniBars: [], icon: 'ondemand_video', color: '#10b981', route: ['/admin', 'videos'] },
  ];

  // Analytics / Chat / Consent: no tracking or chat backend exists yet — panels render an "unavailable" state
  analyticsAvailable = false;
  chatAvailable = false;
  consentAvailable = false;
  contactBars: any[] = [];
  visitBars: any[] = [];
  totalViews = 0;
  uniqueVisitors = 0;
  publishedPosts = 0;
  draftPosts = 0;
  topPosts: any[] = [];
  consentTotal = 0;
  consentAnalyticsRate = 0;
  consentMarketingRate = 0;
  todaySessions: any[] = [];

  // Quick links
  quickLinks = [{ route: ['/admin', 'articles'], icon: 'article', labelKey: 'admin.quick_articles' }];

  // Contacts (real, from /contacts)
  recentContacts: any[] = [];
  unreadCount = 0;
  selectedContact: any = null;

  // System
  systemHealth: any = { ok: true };
  systemDetails: any = { version: '1.0.0', environment: 'dev' };

  // Logout
  logoutLoading = false;

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  trackByLabel(index: number, item: any) { return item.labelKey ?? item.label ?? index; }

  loadData() {
    this.loading = true;
    forkJoin({
      stats: this.api.getStats(),
      contacts: this.api.listContacts(),
    }).subscribe({
      next: ({ stats, contacts }) => {
        this.stats[0].value = stats.articles;
        this.stats[1].value = stats.books;
        this.stats[2].value = stats.videos;
        this.recentContacts = (contacts || []).map((c: any) => ({
          _id: c.id,
          name: c.nome,
          email: c.email,
          subject: c.oggetto,
          message: c.messaggio,
          createdAt: c.createdAt,
          read: c.read,
        }));
        this.unreadCount = stats.unreadContacts;
        this.loading = false;
        this.lastLoadedAt = new Date();
        this.actionMessageKey = 'admin.data_refreshed';
        setTimeout(() => (this.actionMessageKey = ''), 3000);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      },
    });
  }

  openContact(c: any) {
    this.selectedContact = c;
    if (c?._id && !c.read) {
      this.api.markContactRead(c._id).subscribe({
        next: () => {
          c.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (err) => console.error('Error marking contact as read:', err),
      });
    }
  }
  closeContact() { this.selectedContact = null; }

  logout() { this.logoutLoading = true; setTimeout(() => { this.logoutLoading = false; }, 1000); }
}
