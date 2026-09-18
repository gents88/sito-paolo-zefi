import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-contacts',
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './dashboard-contacts.component.html',
  styleUrls: ['./dashboard-contacts.component.scss'],
})
export class DashboardContactsComponent {
  @Input() recentContacts: any[] = [];
  @Input() unreadCount = 0;
  @Output() contactOpened = new EventEmitter<any>();
  @Output() contactsDeleted = new EventEmitter<string[]>();

  constructor(private api: AdminApiService) {}

  allSelected = false;
  selectedIds = new Set<string>();
  bulkDeleting = false;

  get anySelected(){ return this.selectedIds.size > 0; }

  trackByContact(index: number, item: any){ return item._id ?? (item.email + item.createdAt); }

  toggleSelectAll(){
    this.allSelected = !this.allSelected;
    if(this.allSelected){
      this.recentContacts.forEach(c=> c._id && this.selectedIds.add(c._id));
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelectContact(id: string){
    if(this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
    this.allSelected = this.selectedIds.size === this.recentContacts.length;
  }

  deleteSelected(){
    if (!this.anySelected) return;
    const ids = Array.from(this.selectedIds);
    this.bulkDeleting = true;
    this.api.deleteContacts(ids.map(Number)).subscribe({
      next: () => {
        this.bulkDeleting = false;
        this.recentContacts = this.recentContacts.filter(c => !this.selectedIds.has(c._id));
        this.selectedIds.clear();
        this.allSelected = false;
        this.contactsDeleted.emit(ids);
      },
      error: (err) => {
        console.error('Error deleting contacts:', err);
        this.bulkDeleting = false;
      },
    });
  }

  openContact(c: any){ this.contactOpened.emit(c); }
}
