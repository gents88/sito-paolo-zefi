import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="admin-container">
      <nav class="navbar">
        <div class="navbar-brand">{{ 'admin.title' | translate }}</div>
        <button class="logout-btn" (click)="onLogout()">{{ 'common.logout' | translate }}</button>
      </nav>

      <div class="admin-content">
        <header class="header">
          <h1>{{ 'home.welcome' | translate }}, {{ currentUser()?.email }}!</h1>
          <p class="role-badge">{{ 'admin.profile' | translate }}: {{ currentUser()?.role }}</p>
        </header>

        <section class="dashboard-section">
          <h2>{{ 'admin.dashboard' | translate }}</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>{{ 'admin.users' | translate }}</h3>
              <p class="stat-number">1</p>
            </div>
            <div class="stat-card">
              <h3>{{ 'admin.status' | translate }}</h3>
              <p class="stat-number">🟢 {{ 'common.success' | translate }}</p>
            </div>
            <div class="stat-card">
              <h3>{{ 'admin.profile' | translate }}</h3>
              <p class="stat-number">{{ getCurrentTime() }}</p>
            </div>
          </div>
        </section>

        <section class="dashboard-section">
          <h2>{{ 'admin.profile' | translate }}</h2>
          <div class="user-info">
            <div class="info-row">
              <span class="label">{{ 'common.id' | translate }}:</span>
              <span class="value">{{ currentUser()?.id }}</span>
            </div>
            <div class="info-row">
              <span class="label">{{ 'common.email' | translate }}:</span>
              <span class="value">{{ currentUser()?.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">{{ 'admin.profile' | translate }}:</span>
              <span class="value">{{ currentUser()?.role }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        min-height: 100vh;
        background-color: #f5f5f5;
      }

      .navbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .navbar-brand {
        font-size: 1.5rem;
        font-weight: 700;
      }

      .logout-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
          background: white;
          color: #667eea;
        }
      }

      .admin-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .role-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }
      }

      .dashboard-section {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        h2 {
          color: #333;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #667eea;
          padding-bottom: 0.5rem;
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .stat-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;

        h3 {
          margin-bottom: 0.5rem;
          opacity: 0.9;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
        }
      }

      .user-info {
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #667eea;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 600;
          color: #666;
        }

        .value {
          color: #333;
          word-break: break-all;
        }
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  currentUser = signal<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.currentUser.set(user);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentTime(): string {
    return new Date().toLocaleString();
  }
}
