import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-dashboard-chat',
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './dashboard-chat.component.html',
  styleUrls: ['./dashboard-chat.component.scss'],
})
export class DashboardChatComponent {
  @Input() available = true;
  @Input() todaySessions: any[] = [];

  expandedSessionId: string | null = null;
  todaySessionsPage = 1;
  todaySessionsTotalPages = 1;

  toggleSession(id: string){ this.expandedSessionId = this.expandedSessionId === id ? null : id; }
  sessionPreview(session: any){ return (session.messages?.[0]?.content ?? '').slice(0,40); }
}
