import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [RouterModule, MatSidenavModule, MatListModule, MatToolbarModule, TranslateModule],
  template: `
    <mat-toolbar color="primary">{{ 'admin.title' | translate }}</mat-toolbar>
    <div class="admin-shell">
      <mat-sidenav-container>
        <mat-sidenav mode="side" opened>
          <mat-nav-list>
            <a mat-list-item routerLink="/admin">{{ 'admin.dashboard' | translate }}</a>
            <a mat-list-item routerLink="/admin/articles">{{ 'admin.articles' | translate }}</a>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <div class="container"><router-outlet></router-outlet></div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`.admin-shell { height: calc(100vh - 64px); } .container{ padding:16px }`],
})
export class AdminLayoutComponent {
  collapsed = signal(false);
}
