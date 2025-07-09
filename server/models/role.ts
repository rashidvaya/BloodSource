export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory role store (replace with DB in production)
export const roles: Role[] = []; 