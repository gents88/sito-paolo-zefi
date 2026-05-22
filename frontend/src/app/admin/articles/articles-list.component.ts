import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminApiService } from '../../core/services/admin-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-articles-list',
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <div>
      <div class="toolbar">
        <button mat-flat-button color="primary" routerLink="/admin/articles/new">{{ 'admin.articles.new' | translate }}</button>
      </div>
      <table mat-table [dataSource]="articles()">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>{{ 'common.title' | translate }}</th>
          <td mat-cell *matCellDef="let el">{{el.title}}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'common.actions' | translate }}</th>
          <td mat-cell *matCellDef="let el">
            <button mat-button [routerLink]="['/admin/articles', el.id, 'edit']">{{ 'common.edit' | translate }}</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['title','actions']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['title','actions'];"></tr>
      </table>
    </div>
  `,
  styles: ['.toolbar{display:flex;justify-content:flex-end;margin-bottom:8px}']
})
export class AdminArticlesListComponent implements OnInit {
  articles = signal<any[]>([]);

  constructor(private api: AdminApiService) {}

  ngOnInit() {
    this.api.listArticles({ page: 1, limit: 20 }).subscribe(res => this.articles.set(res || []));
  }
}
