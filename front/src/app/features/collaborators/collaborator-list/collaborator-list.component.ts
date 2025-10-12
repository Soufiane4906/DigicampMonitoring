import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { Collaborator } from '../../../core/models/collaborator.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { CollaboratorFormDialogComponent } from '../components/collaborator-form-dialog/collaborator-form-dialog.component';

@Component({
  selector: 'app-collaborator-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    TagModule,
    AvatarModule,
    InputTextModule,
    ChipModule,
    ConfirmDialogModule,
    ToastModule,
    CollaboratorFormDialogComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="layout">
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

      <div class="container">
        <div class="page-header">
          <div class="header-content">
            <h1>
              <i class="pi pi-users"></i>
              Gestion des Collaborateurs
            </h1>
            <p>Gérez votre équipe et leurs compétences</p>
          </div>
          <p-button label="Nouveau collaborateur" 
                    icon="pi pi-user-plus" 
                    (onClick)="createCollaborator()"
                    severity="success"
                    [raised]="true" />
        </div>

        <div class="collaborators-card">
          <div class="card-toolbar">
            <span class="p-input-icon-left search-input">
              <i class="pi pi-search"></i>
              <input pInputText type="text" 
                     placeholder="Rechercher un collaborateur..." 
                     [(ngModel)]="searchTerm"
                     (input)="onSearch()" />
            </span>
            <div class="toolbar-actions">
              <p-button icon="pi pi-filter" 
                        label="Filtres"
                        [outlined]="true"
                        severity="secondary" />
              <p-button icon="pi pi-refresh" 
                        (onClick)="loadCollaborators()"
                        [outlined]="true"
                        severity="secondary"
                        pTooltip="Actualiser"
                        tooltipPosition="bottom" />
            </div>
          </div>

          <p-table [value]="collaborators" 
                   [loading]="loading"
                   [paginator]="true"
                   [rows]="10"
                   [totalRecords]="totalRecords"
                   [lazy]="true"
                   (onLazyLoad)="loadCollaborators($event)"
                   styleClass="modern-table"
                   [tableStyle]="{'min-width': '60rem'}">
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="firstName">
                  Collaborateur
                  <p-sortIcon field="firstName"></p-sortIcon>
                </th>
                <th>Email</th>
                <th>Grade</th>
                <th>Poste</th>
                <th>Site</th>
                <th>Compétences</th>
                <th>Disponibilité</th>
                <th style="width: 180px">Actions</th>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-collaborator>
              <tr class="collaborator-row">
                <td>
                  <div class="collaborator-info">
                    <p-avatar [label]="getCollaboratorInitials(collaborator)" 
                              styleClass="collaborator-avatar"
                              shape="circle" 
                              size="large" />
                    <div class="collaborator-details">
                      <strong>{{ collaborator.firstName }} {{ collaborator.lastName }}</strong>
                      <span class="text-muted">{{ collaborator.position || 'Sans poste' }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  @if (collaborator.email) {
                    <span class="email">
                      <i class="pi pi-envelope"></i>
                      {{ collaborator.email }}
                    </span>
                  } @else {
                    <span class="text-muted">-</span>
                  }
                </td>
                <td>
                  @if (collaborator.grade) {
                    <p-chip [label]="collaborator.grade" styleClass="grade-chip" />
                  } @else {
                    <span class="text-muted">-</span>
                  }
                </td>
                <td>{{ collaborator.position || '-' }}</td>
                <td>
                  @if (collaborator.site) {
                    <span class="site-badge">
                      <i class="pi pi-map-marker"></i>
                      {{ collaborator.site }}
                    </span>
                  } @else {
                    <span class="text-muted">-</span>
                  }
                </td>
                <td>
                  @if (collaborator.skills && collaborator.skills.length > 0) {
                    <div class="skills-container">
                      @for (skill of getDisplaySkills(collaborator.skills); track skill) {
                        <p-chip [label]="skill" styleClass="skill-chip" />
                      }
                      @if (collaborator.skills.length > 3) {
                        <p-chip [label]="'+' + (collaborator.skills.length - 3)" styleClass="more-chip" />
                      }
                    </div>
                  } @else {
                    <span class="text-muted">Aucune</span>
                  }
                </td>
                <td>
                  <p-tag [value]="collaborator.available ? 'Disponible' : 'Occupé'" 
                         [severity]="collaborator.available ? 'success' : 'warning'"
                         [rounded]="true" />
                </td>
                <td>
                  <div class="action-buttons">
                    <p-button icon="pi pi-eye" 
                              [rounded]="true" 
                              [text]="true"
                              severity="info"
                              pTooltip="Voir"
                              tooltipPosition="top"
                              (onClick)="viewCollaborator(collaborator)" />
                    <p-button icon="pi pi-pencil" 
                              [rounded]="true" 
                              [text]="true"
                              severity="warning"
                              pTooltip="Modifier"
                              tooltipPosition="top"
                              (onClick)="editCollaborator(collaborator)" />
                    <p-button icon="pi pi-trash" 
                              [rounded]="true" 
                              [text]="true"
                              severity="danger"
                              pTooltip="Supprimer"
                              tooltipPosition="top"
                              (onClick)="confirmDelete(collaborator)" />
                  </div>
                </td>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="8">
                  <div class="empty-state">
                    <i class="pi pi-users"></i>
                    <h3>Aucun collaborateur trouvé</h3>
                    <p>Commencez par ajouter des membres à votre équipe</p>
                    <p-button label="Ajouter un collaborateur" 
                              icon="pi pi-user-plus"
                              (onClick)="createCollaborator()" />
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>

    <!-- Collaborator Form Dialog -->
    <app-collaborator-form-dialog
      [(visible)]="displayDialog"
      [collaborator]="selectedCollaborator"
      (collaboratorSaved)="onCollaboratorSaved()">
    </app-collaborator-form-dialog>

    <!-- Confirmation Dialog -->
    <p-confirmDialog styleClass="custom-confirm-dialog"></p-confirmDialog>

    <!-- Toast Messages -->
    <p-toast position="top-right"></p-toast>
  `,
  styles: [`
    .layout {
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

    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
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

    .header-content h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-content h1 i {
      color: #f5576c;
    }

    .header-content p {
      color: #666;
      margin: 0;
      font-size: 1rem;
    }

    .collaborators-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      animation: fadeIn 0.5s ease-out;
    }

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

    .card-toolbar {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .search-input {
      flex: 1;
      max-width: 400px;
    }

    .search-input input {
      width: 100%;
      border-radius: 8px;
    }

    .toolbar-actions {
      display: flex;
      gap: 0.75rem;
    }

    ::ng-deep .modern-table {
      border: none;
    }

    ::ng-deep .modern-table .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
      border: none;
      padding: 1rem 1.5rem;
    }

    ::ng-deep .modern-table .p-datatable-tbody > tr {
      transition: all 0.3s ease;
    }

    ::ng-deep .modern-table .p-datatable-tbody > tr:hover {
      background: #f8f9fa !important;
    }

    ::ng-deep .modern-table .p-datatable-tbody > tr > td {
      border: none;
      border-bottom: 1px solid #e9ecef;
      padding: 1.25rem 1.5rem;
    }

    .collaborator-row {
      cursor: pointer;
    }

    .collaborator-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    ::ng-deep .collaborator-avatar {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      font-weight: 700;
    }

    .collaborator-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .collaborator-details strong {
      color: #333;
    }

    .text-muted {
      color: #999;
      font-size: 0.875rem;
    }

    .email {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }

    .email i {
      color: #667eea;
    }

    ::ng-deep .grade-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .site-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 0.875rem;
      color: #495057;
    }

    .site-badge i {
      color: #f5576c;
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    ::ng-deep .skill-chip {
      background: #e3f2fd;
      color: #1976d2;
      font-size: 0.8rem;
    }

    ::ng-deep .more-chip {
      background: #f5f5f5;
      color: #666;
      font-size: 0.8rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-end;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-state i {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: #666;
      margin: 0 0 1.5rem 0;
    }

    ::ng-deep .custom-confirm-dialog .p-dialog-header {
      background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
      color: white;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .card-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-input {
        max-width: 100%;
      }

      .navbar {
        padding: 0 1rem;
      }

      .container {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class CollaboratorListComponent implements OnInit {
  private collaboratorService = inject(CollaboratorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  collaborators: Collaborator[] = [];
  loading = false;
  totalRecords = 0;
  searchTerm = '';
  currentUser = this.authService.getCurrentUser();
  menuItems: MenuItem[] = [];
  
  displayDialog = false;
  selectedCollaborator?: Collaborator;

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

  getUserInitials(): string {
    if (!this.currentUser?.username) return '?';
    return this.currentUser.username.substring(0, 2).toUpperCase();
  }

  getCollaboratorInitials(collaborator: Collaborator): string {
    const first = collaborator.firstName?.charAt(0) || '';
    const last = collaborator.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '??';
  }

  getDisplaySkills(skills: string[]): string[] {
    return skills.slice(0, 3);
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
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les collaborateurs'
        });
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    // TODO: Implement search functionality
    console.log('Search:', this.searchTerm);
  }

  createCollaborator(): void {
    this.selectedCollaborator = undefined;
    this.displayDialog = true;
  }

  viewCollaborator(collaborator: Collaborator): void {
    this.router.navigate(['/collaborators', collaborator.id]);
  }

  editCollaborator(collaborator: Collaborator): void {
    this.selectedCollaborator = collaborator;
    this.displayDialog = true;
  }

  confirmDelete(collaborator: Collaborator): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${collaborator.firstName} ${collaborator.lastName} ? Cette action est irréversible.`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteCollaborator(collaborator);
      }
    });
  }

  deleteCollaborator(collaborator: Collaborator): void {
    this.collaboratorService.deleteCollaborator(collaborator.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `${collaborator.firstName} ${collaborator.lastName} a été supprimé(e)`
        });
        this.loadCollaborators();
      },
      error: (error) => {
        console.error('Error deleting collaborator:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de supprimer le collaborateur'
        });
      }
    });
  }

  onCollaboratorSaved(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: this.selectedCollaborator ? 'Collaborateur mis à jour' : 'Collaborateur créé'
    });
    this.loadCollaborators();
  }

  logout(): void {
    this.authService.logout();
  }
}
