import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    MenubarModule,
    AvatarModule
  ],
  template: `
    <div class="dashboard-layout">
      <nav class="navbar">
        <div class="navbar-brand">
          <i class="pi pi-chart-line brand-icon"></i>
          <span class="brand-name">DigicampMonitoring</span>
        </div>
        <p-menubar [model]="menuItems" styleClass="main-menu">
          <ng-template pTemplate="end">
            <div class="user-section">
              <p-avatar [label]="getUserInitials()" 
                        styleClass="user-avatar" 
                        shape="circle" />
              <span class="username">{{ currentUser?.username }}</span>
              <p-button icon="pi pi-sign-out" 
                        (onClick)="logout()"
                        [rounded]="true"
                        [text]="true"
                        severity="secondary"
                        pTooltip="Déconnexion"
                        tooltipPosition="bottom" />
            </div>
          </ng-template>
        </p-menubar>
      </nav>

      <div class="dashboard-container">
        <div class="welcome-section">
          <div class="welcome-content">
            <h1>Bienvenue, {{ currentUser?.username }} ! 👋</h1>
            <p>Gérez vos projets et vos équipes en toute simplicité</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-card">
              <i class="pi pi-folder stat-icon"></i>
              <div class="stat-content">
                <span class="stat-value">--</span>
                <span class="stat-label">Projets actifs</span>
              </div>
            </div>
            <div class="stat-card">
              <i class="pi pi-users stat-icon"></i>
              <div class="stat-content">
                <span class="stat-value">--</span>
                <span class="stat-label">Collaborateurs</span>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Accès rapide</h2>
          <div class="actions-grid">
            <div class="action-card" (click)="navigateTo('/projects')">
              <div class="action-icon-wrapper projects">
                <i class="pi pi-folder"></i>
              </div>
              <div class="action-content">
                <h3>Projets</h3>
                <p>Gérez vos projets et suivez leur progression en temps réel</p>
                <span class="action-link">
                  Voir les projets
                  <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </div>

            <div class="action-card" (click)="navigateTo('/collaborators')">
              <div class="action-icon-wrapper collaborators">
                <i class="pi pi-users"></i>
              </div>
              <div class="action-content">
                <h3>Collaborateurs</h3>
                <p>Gérez vos collaborateurs, leurs compétences et disponibilités</p>
                <span class="action-link">
                  Voir les collaborateurs
                  <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </div>

            <div class="action-card disabled">
              <div class="action-icon-wrapper newsletter">
                <i class="pi pi-file-pdf"></i>
              </div>
              <div class="action-content">
                <h3>Newsletter <span class="badge">Bientôt</span></h3>
                <p>Générez la newsletter mensuelle au format PDF</p>
                <span class="action-link disabled">
                  Générer
                  <i class="pi pi-lock"></i>
                </span>
              </div>
            </div>

            <div class="action-card disabled">
              <div class="action-icon-wrapper reports">
                <i class="pi pi-chart-bar"></i>
              </div>
              <div class="action-content">
                <h3>Rapports <span class="badge">Bientôt</span></h3>
                <p>Consultez les statistiques et rapports d'activité</p>
                <span class="action-link disabled">
                  Voir les rapports
                  <i class="pi pi-lock"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .navbar {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 0;
    }

    .brand-icon {
      font-size: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
    }

    ::ng-deep .main-menu {
      background: transparent;
      border: none;
      flex: 1;
    }

    ::ng-deep .main-menu .p-menubar-root-list {
      gap: 0.5rem;
    }

    ::ng-deep .main-menu .p-menuitem-link {
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    ::ng-deep .main-menu .p-menuitem-link:hover {
      background: #f8f9fa;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    ::ng-deep .user-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }

    .username {
      font-weight: 600;
      color: #333;
    }

    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
    }

    .welcome-section {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .welcome-content h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .welcome-content p {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .welcome-stats {
      display: flex;
      gap: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
      min-width: 160px;
    }

    .stat-icon {
      font-size: 2rem;
      color: #667eea;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .quick-actions h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 1.5rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeIn 0.5s ease-out;
      animation-fill-mode: both;
    }

    .action-card:nth-child(1) { animation-delay: 0.1s; }
    .action-card:nth-child(2) { animation-delay: 0.2s; }
    .action-card:nth-child(3) { animation-delay: 0.3s; }
    .action-card:nth-child(4) { animation-delay: 0.4s; }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .action-card:not(.disabled):hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .action-card.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .action-icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .action-icon-wrapper i {
      font-size: 2rem;
      color: white;
    }

    .action-icon-wrapper.projects {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .action-icon-wrapper.collaborators {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .action-icon-wrapper.newsletter {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .action-icon-wrapper.reports {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .action-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge {
      font-size: 0.75rem;
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 600;
    }

    .action-content p {
      color: #666;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
    }

    .action-link {
      color: #667eea;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: gap 0.3s ease;
    }

    .action-link.disabled {
      color: #999;
    }

    .action-card:not(.disabled):hover .action-link {
      gap: 0.75rem;
    }

    @media (max-width: 768px) {
      .welcome-section {
        flex-direction: column;
        align-items: flex-start;
      }

      .welcome-stats {
        width: 100%;
        flex-direction: column;
      }

      .stat-card {
        width: 100%;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .navbar {
        padding: 0 1rem;
      }

      .dashboard-container {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser();
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => this.navigateTo('/dashboard')
      },
      {
        label: 'Projets',
        icon: 'pi pi-folder',
        command: () => this.navigateTo('/projects')
      },
      {
        label: 'Collaborateurs',
        icon: 'pi pi-users',
        command: () => this.navigateTo('/collaborators')
      }
    ];
  }

  getUserInitials(): string {
    if (!this.currentUser?.username) return '?';
    return this.currentUser.username.substring(0, 2).toUpperCase();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
