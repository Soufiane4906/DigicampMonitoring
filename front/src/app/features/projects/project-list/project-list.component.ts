import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    MenubarModule
  ],
  template: `
    <div class="layout">
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
        <div class="header">
          <h1>Gestion des Projets</h1>
          <p-button label="Nouveau projet" 
                    icon="pi pi-plus" 
                    (onClick)="createProject()" />
        </div>

        <p-card>
          <p-table [value]="projects" 
                   [loading]="loading"
                   [paginator]="true"
                   [rows]="10"
                   [totalRecords]="totalRecords"
                   [lazy]="true"
                   (onLazyLoad)="loadProjects($event)"
                   styleClass="p-datatable-striped">
            <ng-template pTemplate="header">
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-project>
              <tr>
                <td>{{ project.name }}</td>
                <td>{{ project.description || '-' }}</td>
                <td>{{ project.startDate | date:'dd/MM/yyyy' }}</td>
                <td>{{ project.endDate ? (project.endDate | date:'dd/MM/yyyy') : '-' }}</td>
                <td>
                  <span class="status-badge" [style.background-color]="project.status.color">
                    {{ project.status.label }}
                  </span>
                </td>
                <td>
                  <p-button icon="pi pi-pencil" 
                            styleClass="p-button-rounded p-button-text" 
                            (onClick)="editProject(project)" />
                  <p-button icon="pi pi-trash" 
                            styleClass="p-button-rounded p-button-text p-button-danger" 
                            (onClick)="deleteProject(project)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center">Aucun projet trouvé</td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2rem;
      color: #333;
      margin: 0;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
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

    .text-center {
      text-align: center;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  projects: Project[] = [];
  loading = false;
  totalRecords = 0;
  currentUser = this.authService.getCurrentUser();
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/dashboard'])
      },
      {
        label: 'Projets',
        icon: 'pi pi-folder',
        command: () => this.router.navigate(['/projects'])
      },
      {
        label: 'Collaborateurs',
        icon: 'pi pi-users',
        command: () => this.router.navigate(['/collaborators'])
      }
    ];
  }

  loadProjects(event?: any): void {
    this.loading = true;
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : 10;

    this.projectService.getProjects(page, size).subscribe({
      next: (response) => {
        this.projects = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  createProject(): void {
    // TODO: Implement create project dialog
    console.log('Create project');
  }

  editProject(project: Project): void {
    // TODO: Implement edit project dialog
    console.log('Edit project:', project);
  }

  deleteProject(project: Project): void {
    // TODO: Implement delete confirmation
    console.log('Delete project:', project);
  }

  logout(): void {
    this.authService.logout();
  }
}
