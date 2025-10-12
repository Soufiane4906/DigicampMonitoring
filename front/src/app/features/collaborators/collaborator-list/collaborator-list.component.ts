import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { Collaborator } from '../../../core/models/collaborator.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-collaborator-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    TagModule
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
          <h1>Gestion des Collaborateurs</h1>
          <p-button label="Nouveau collaborateur" 
                    icon="pi pi-plus" 
                    (onClick)="createCollaborator()" />
        </div>

        <p-card>
          <p-table [value]="collaborators" 
                   [loading]="loading"
                   [paginator]="true"
                   [rows]="10"
                   [totalRecords]="totalRecords"
                   [lazy]="true"
                   (onLazyLoad)="loadCollaborators($event)"
                   styleClass="p-datatable-striped">
            <ng-template pTemplate="header">
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Poste</th>
                <th>Site</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-collaborator>
              <tr>
                <td>{{ collaborator.firstName }} {{ collaborator.lastName }}</td>
                <td>{{ collaborator.email || '-' }}</td>
                <td>{{ collaborator.grade || '-' }}</td>
                <td>{{ collaborator.position || '-' }}</td>
                <td>{{ collaborator.site || '-' }}</td>
                <td>
                  <p-tag [value]="collaborator.available ? 'Disponible' : 'Occupé'" 
                         [severity]="collaborator.available ? 'success' : 'warning'" />
                </td>
                <td>
                  <p-button icon="pi pi-pencil" 
                            styleClass="p-button-rounded p-button-text" 
                            (onClick)="editCollaborator(collaborator)" />
                  <p-button icon="pi pi-trash" 
                            styleClass="p-button-rounded p-button-text p-button-danger" 
                            (onClick)="deleteCollaborator(collaborator)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7" class="text-center">Aucun collaborateur trouvé</td>
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
export class CollaboratorListComponent implements OnInit {
  private collaboratorService = inject(CollaboratorService);
  private authService = inject(AuthService);
  private router = inject(Router);

  collaborators: Collaborator[] = [];
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

  loadCollaborators(event?: any): void {
    this.loading = true;
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : 10;

    this.collaboratorService.getCollaborators(page, size).subscribe({
      next: (response) => {
        this.collaborators = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collaborators:', error);
        this.loading = false;
      }
    });
  }

  createCollaborator(): void {
    // TODO: Implement create collaborator dialog
    console.log('Create collaborator');
  }

  editCollaborator(collaborator: Collaborator): void {
    // TODO: Implement edit collaborator dialog
    console.log('Edit collaborator:', collaborator);
  }

  deleteCollaborator(collaborator: Collaborator): void {
    // TODO: Implement delete confirmation
    console.log('Delete collaborator:', collaborator);
  }

  logout(): void {
    this.authService.logout();
  }
}
