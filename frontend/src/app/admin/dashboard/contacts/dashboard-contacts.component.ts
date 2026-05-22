import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-dashboard-contacts',
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './dashboard-contacts.component.html',
  styleUrls: ['./dashboard-contacts.component.scss'],
})
export class DashboardContactsComponent {
  @Input() recentContacts: any[] = [ { _id: 'c1', name: 'Paolo', email: 'paolo@example.com', subject: 'Info', message: 'Hello', createdAt: new Date(), read: false } ];
  @Input() unreadCount = 1;
  @Output() contactOpened = new EventEmitter<any>();

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
    this.bulkDeleting = true;
    setTimeout(()=>{
      this.bulkDeleting = false;
      this.selectedIds.clear();
    }, 800);
  }

  openContact(c: any){ this.contactOpened.emit(c); }
}
