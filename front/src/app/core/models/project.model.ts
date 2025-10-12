export interface Project {
  id: number;
  name: string;
  logo?: string;  // Base64 ou URL
  logoUrl?: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStatus {
  id: number;
  code: string;
  label: string;
  value?: string;  // Ajout pour compatibilité
  color?: string;
  displayOrder?: number;
}

export interface ProjectRequest {
  name: string;
  logo?: string;
  logoUrl?: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate?: string;
  statusId: number;
}
