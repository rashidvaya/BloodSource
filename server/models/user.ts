export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string; // hashed
  roleId: string;
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory user store (replace with DB in production)
export const users: User[] = []; 