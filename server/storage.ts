import { User, LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserResponse } from "@shared/schema";

export interface IStorage {
  // User management
  createUser(userData: Omit<User, "id" | "createdAt">): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  // New admin management methods
  listUsers(): Promise<User[]>;
  updateUserRole(id: string, role: User["role"]): Promise<User | null>;
  updateUserPermissions(id: string, permissions: User["permissions"]): Promise<User | null>;
  
  // Authentication
  validateLogin(credentials: LoginRequest): Promise<LoginResponse>;
  registerUser(userData: SignupRequest): Promise<SignupResponse>;
  // Invitation code verification
  verifyInvitationCode(code: string): Promise<{ valid: boolean; message: string }>;
}

export class MemStorage implements IStorage {
  private users: User[] = [
    // Default test user for development
    {
      id: "test-user-1",
      email: "test@example.com",
      username: "testuser",
      fullName: "Test User",
      phone: "1234567890",
      division: "Dhaka",
      district: "Dhaka",
      mainPoint: "Dhaka University",
      bloodGroup: "O+",
      gender: "Men",
      dateOfBirth: "1990-01-01",
      idType: "NID",
      idNumber: "12345678901234567",
      password: "test123",
      createdAt: new Date(),
      role: "super_admin",
      permissions: [],
    },
  ];

  private invitationCodes: Array<{
    id: string;
    code: string;
    isActive: boolean;
    maxUses: number;
    currentUses: number;
    createdBy: string;
    createdAt: Date;
    expiresAt?: Date;
  }> = [
    // Default invitation codes for development
    {
      id: "inv-1",
      code: "123456",
      isActive: true,
      maxUses: 10,
      currentUses: 0,
      createdBy: "admin",
      createdAt: new Date(),
    },
    {
      id: "inv-2", 
      code: "666666",
      isActive: true,
      maxUses: 5,
      currentUses: 0,
      createdBy: "admin",
      createdAt: new Date(),
    },
  ];

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date(),
      role: userData.role || "user",
      permissions: userData.permissions || [],
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

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async validateLogin(credentials: LoginRequest): Promise<LoginResponse> {
    // Find user by email or username
    const user = await this.getUserByEmail(credentials.username) || 
                 await this.getUserByUsername(credentials.username);
    
    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
    
    // Check if password matches
    if (user.password !== credentials.password) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
    
    // Remove password from user object before returning
    const { password, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: "Login successful",
      user: userWithoutPassword as UserResponse,
    };
  }

  async registerUser(userData: SignupRequest): Promise<SignupResponse> {
    // Check if user already exists by email
    const existingUserByEmail = await this.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Check if username is already taken
    const existingUserByUsername = await this.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      return {
        success: false,
        message: "Username is already taken",
      };
    }

    // Verify invitation code
    const invitationValid = await this.verifyInvitationCode(userData.invitation);
    if (!invitationValid.valid) {
      return {
        success: false,
        message: "Invalid invitation code",
      };
    }

    // Create new user with all the required fields
    const newUser = await this.createUser({
      email: userData.email,
      username: userData.username,
      fullName: userData.fullName,
      phone: userData.phone,
      division: userData.division,
      district: userData.district,
      mainPoint: userData.mainPoint,
      bloodGroup: userData.bloodGroup,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
      idType: userData.idType,
      idNumber: userData.idNumber,
      password: userData.password,
      role: "user",
      permissions: [],
    });

    // Use the invitation code (increment usage count)
    const useResult = await this.useInvitationCode(userData.invitation);
    if (!useResult.success) {
      // If we can't use the code, we should rollback the user creation
      // For now, we'll just log the error
      console.error('Failed to use invitation code:', useResult.message);
    }

    return {
      success: true,
      message: "Account created successfully",
      user: (() => {
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword as UserResponse;
      })(),
    };
  }

  async verifyInvitationCode(code: string): Promise<{ valid: boolean; message: string }> {
    const invitationCode = this.invitationCodes.find(ic => ic.code === code);
    
    if (!invitationCode) {
      return { valid: false, message: 'Invalid invitation code' };
    }

    if (!invitationCode.isActive) {
      return { valid: false, message: 'Invitation code is inactive' };
    }

    if (invitationCode.expiresAt && invitationCode.expiresAt < new Date()) {
      return { valid: false, message: 'Invitation code has expired' };
    }

    if (invitationCode.currentUses >= invitationCode.maxUses) {
      return { valid: false, message: 'Invitation code has reached maximum uses' };
    }

    return { valid: true, message: 'Invitation code is valid' };
  }

  async useInvitationCode(code: string): Promise<{ success: boolean; message: string }> {
    const invitationCode = this.invitationCodes.find(ic => ic.code === code);
    
    if (!invitationCode) {
      return { success: false, message: 'Invitation code not found' };
    }

    invitationCode.currentUses += 1;
    return { success: true, message: 'Invitation code used successfully' };
  }

  async listUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUserRole(id: string, role: User["role"]): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.role = role;
      return user;
    }
    return null;
  }

  async updateUserPermissions(id: string, permissions: User["permissions"]): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.permissions = permissions;
      return user;
    }
    return null;
  }
}
