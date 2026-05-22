import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
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
export class DashboardMainComponent {
  loading = false;
  actionMessageKey = '';
  lastLoadedAt: Date | null = null;

  // Stats
  stats = [
    { labelKey: 'admin.cards.articles', value: 12, miniBars: [20,40,60,30], icon: 'article', color: '#6366f1', route: ['/admin','articles'] },
    { labelKey: 'admin.cards.books', value: 4, miniBars: [10,30,20], icon: 'book', color: '#f59e0b', route: ['/admin','books'] },
    { labelKey: 'admin.cards.videos', value: 8, miniBars: [5,15,25], icon: 'ondemand_video', color: '#10b981', route: ['/admin','videos'] },
  ];

  // Analytics
  contactBars = [
    { date: new Date(Date.now() - 6*86400000), value: 2 },
    { date: new Date(Date.now() - 5*86400000), value: 4 },
    { date: new Date(Date.now() - 4*86400000), value: 6 },
    { date: new Date(Date.now() - 3*86400000), value: 3 },
    { date: new Date(Date.now() - 2*86400000), value: 5 },
    { date: new Date(Date.now() - 86400000), value: 7 },
    { date: new Date(), value: 6 },
  ];

  visitBars = this.contactBars.map(b => ({ date: b.date, value: b.value * 12 }));
  totalViews = 1240;
  uniqueVisitors = 820;
  publishedPosts = 42;
  draftPosts = 7;
  topPosts = [
    { _id: '1', title: 'How to write clean code', slug: 'clean-code', viewCount: 420 },
    { _id: '2', title: 'Angular best practices', slug: 'angular-best', viewCount: 312 },
  ];

  // Consent
  consentTotal = 560;
  consentAnalyticsRate = 0.62;
  consentMarketingRate = 0.21;

  // Quick links
  quickLinks = [ { route: ['/admin','articles'], icon: 'article', labelKey: 'admin.quick_articles' }, { route: ['/admin','users'], icon: 'people', labelKey: 'admin.quick_users' } ];

  // Contacts
  recentContacts: any[] = [ { _id: 'c1', name: 'Paolo', email: 'paolo@example.com', subject: 'Info', message: 'Hello', createdAt: new Date(), read: false } ];
  unreadCount = 1;
  selectedContact: any = null;

  // Chat
  todaySessions: any[] = [ { sessionId: 's1', lastActivity: new Date(), messageCount: 3, messages: [ { role: 'user', content: 'Hi', timestamp: new Date() }, { role: 'assistant', content: 'Hello', timestamp: new Date() } ] } ];

  // System
  systemHealth: any = { ok: true };
  systemDetails: any = { version: '1.0.0', environment: 'dev' };

  // Logout
  logoutLoading = false;

  trackByLabel(index: number, item: any){ return item.labelKey ?? item.label ?? index; }

  loadData(){
    this.loading = true;
    setTimeout(()=>{
      this.loading = false;
      this.lastLoadedAt = new Date();
      this.actionMessageKey = 'admin.data_refreshed';
      setTimeout(()=> this.actionMessageKey = '', 3000);
    }, 700);
  }

  openContact(c: any){ this.selectedContact = c; }
  closeContact(){ this.selectedContact = null; }

  logout(){ this.logoutLoading = true; setTimeout(()=>{ this.logoutLoading = false; }, 1000); }
}
