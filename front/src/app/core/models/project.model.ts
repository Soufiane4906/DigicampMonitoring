export interface Project {
  id: number;
  name: string;
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
  color?: string;
  displayOrder?: number;
}

export interface ProjectRequest {
  name: string;
  logoUrl?: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate?: string;
  statusId: number;
}