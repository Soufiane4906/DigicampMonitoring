import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    MenubarModule
  ],
  template: `
    <div class="dashboard-layout">
      <p-menubar [model]="menuItems">
        <ng-template pTemplate="end">
          <div class="user-info">
            <span>{{ currentUser?.username }}</span>
            <p-button label="Déconnexion" 
                      icon="pi pi-sign-out" 
                      (onClick)="logout()"
                      styleClass="p-button-text" />
          </div>
        </ng-template>
      </p-menubar>

      <div class="container">
        <h1>Tableau de bord</h1>
        <p class="welcome-text">Bienvenue, {{ currentUser?.username }} !</p>

        <div class="dashboard-grid">
          <p-card header="Projets" class="dashboard-card">
            <p>Gérez vos projets et suivez leur progression</p>
            <p-button label="Voir les projets" 
                      icon="pi pi-folder" 
                      (onClick)="navigateTo('/projects')" />
          </p-card>

          <p-card header="Collaborateurs" class="dashboard-card">
            <p>Gérez vos collaborateurs et leurs compétences</p>
            <p-button label="Voir les collaborateurs" 
                      icon="pi pi-users" 
                      (onClick)="navigateTo('/collaborators')" />
          </p-card>

          <p-card header="Newsletter" class="dashboard-card">
            <p>Générez la newsletter mensuelle en PDF</p>
            <p-button label="Générer" 
                      icon="pi pi-file-pdf" 
                      [disabled]="true" />
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .welcome-text {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .dashboard-card {
      height: 100%;
    }

    ::ng-deep .dashboard-card .p-card-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info span {
      font-weight: 600;
      color: #495057;
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

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}