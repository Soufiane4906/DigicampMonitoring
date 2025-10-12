export interface Collaborator {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  grade?: string;
  position?: string;
  site?: string;
  skills?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollaboratorRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  grade?: string;
  position?: string;
  site?: string;
  skills?: string;
  available?: boolean;
}