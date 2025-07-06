import { eq, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, users } from "./db";
import { User, LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserResponse } from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const userId = nanoid();
    const newUser = {
      id: userId,
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
    };

    const [insertedUser] = await db.insert(users).values(newUser).returning();
    
    return {
      ...insertedUser,
      createdAt: insertedUser.createdAt || new Date(),
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  async validateLogin(credentials: LoginRequest): Promise<LoginResponse> {
    // Find user by email or username
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, credentials.username), eq(users.username, credentials.username)));

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
    });

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
    // For demonstration, both '123456' and '666666' are valid 6-digit codes
    if (code === '123456' || code === '666666') {
      return { valid: true, message: 'Invitation code is valid' };
    }
    return { valid: false, message: 'Invalid invitation code' };
  }

  // Additional methods for database management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId));
    return result.length > 0;
  }

  async updateUser(userId: string, userData: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser || null;
  }
} 