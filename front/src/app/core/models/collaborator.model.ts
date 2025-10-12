export interface Collaborator {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  photo?: string;  // Base64 ou URL
  photoUrl?: string;
  grade?: string;
  position?: string;
  site?: string;
  skills?: string | string[];  // Accepte string ou array
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollaboratorRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  photo?: string;
  photoUrl?: string;
  grade?: string;
  position?: string;
  site?: string;
  skills?: string | string[];
  available?: boolean;
}
