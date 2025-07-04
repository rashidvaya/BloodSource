import { User, LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "@shared/schema";

export interface IStorage {
  // User management
  createUser(userData: Omit<User, "id" | "createdAt">): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  
  // Authentication
  validateLogin(credentials: LoginRequest): Promise<LoginResponse>;
  registerUser(userData: SignupRequest): Promise<SignupResponse>;
}

export class MemStorage implements IStorage {
  private users: User[] = [
    // Default test user for development
    {
      id: "test-user-1",
      email: "test@example.com",
      username: "testuser",
      createdAt: new Date(),
    },
  ];

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async validateLogin(credentials: LoginRequest): Promise<LoginResponse> {
    // In a real app, this would validate against a database
    // For now, we'll return a mock response
    const user = await this.getUserByEmail(credentials.username) || 
                 await this.getUserByUsername(credentials.username);
    
    if (user) {
      return {
        success: true,
        message: "Login successful",
        user,
      };
    }
    
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  async registerUser(userData: SignupRequest): Promise<SignupResponse> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Create new user
    const newUser = await this.createUser({
      email: userData.email,
      username: `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}`,
    });

    return {
      success: true,
      message: "Account created successfully",
      user: newUser,
    };
  }
}
