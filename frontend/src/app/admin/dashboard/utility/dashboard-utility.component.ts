import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-dashboard-utility',
  imports: [CommonModule, MatExpansionModule, MatIconModule, TranslateModule],
  templateUrl: './dashboard-utility.component.html',
  styleUrls: ['./dashboard-utility.component.scss'],
})
export class DashboardUtilityComponent {
  @Input() systemHealth: any = { ok: true };
  @Input() systemDetails: any = { version: '1.0.0', environment: 'dev' };
  @Input() unreadCount = 0;

  onLoadData(){ console.log('load data'); }
  onDownloadCsv(){ console.log('download csv'); }
  onResetStats(){ console.log('reset stats'); }
}
