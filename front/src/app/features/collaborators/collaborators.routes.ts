import { Routes } from '@angular/router';

export const COLLABORATORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./collaborator-list/collaborator-list.component').then(m => m.CollaboratorListComponent)
  }
];