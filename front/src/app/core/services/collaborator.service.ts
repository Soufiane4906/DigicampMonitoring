import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Collaborator, CollaboratorRequest } from '../models/collaborator.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/collaborators`;

  getCollaborators(page: number = 0, size: number = 10): Observable<PageResponse<Collaborator>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Collaborator>>(this.apiUrl, { params });
  }

  getAvailableCollaborators(page: number = 0, size: number = 10): Observable<PageResponse<Collaborator>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Collaborator>>(`${this.apiUrl}/available`, { params });
  }

  getCollaborator(id: number): Observable<Collaborator> {
    return this.http.get<Collaborator>(`${this.apiUrl}/${id}`);
  }

  createCollaborator(collaborator: CollaboratorRequest): Observable<Collaborator> {
    return this.http.post<Collaborator>(this.apiUrl, collaborator);
  }

  updateCollaborator(id: number, collaborator: CollaboratorRequest): Observable<Collaborator> {
    return this.http.put<Collaborator>(`${this.apiUrl}/${id}`, collaborator);
  }

  deleteCollaborator(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}