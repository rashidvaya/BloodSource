import { eq, or, and, lt, gte } from "drizzle-orm";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users, invitationCodes } from "../shared/schema";
import { User, LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserResponse } from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const userId = nanoid();
    
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
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
      password: hashedPassword,
      createdAt: new Date(),
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

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isPasswordValid) {
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
    try {
      // Find the invitation code in the database
      const [invitationCode] = await db
        .select()
        .from(invitationCodes)
        .where(eq(invitationCodes.code, code));

      if (!invitationCode) {
        return { valid: false, message: 'Invalid invitation code' };
      }

      // Check if the code is active
      if (!invitationCode.isActive) {
        return { valid: false, message: 'Invitation code is inactive' };
      }

      // Check if the code has expired
      if (invitationCode.expiresAt && invitationCode.expiresAt < new Date()) {
        return { valid: false, message: 'Invitation code has expired' };
      }

      // Check if the code has reached its maximum uses
      if (invitationCode.currentUses >= invitationCode.maxUses) {
        return { valid: false, message: 'Invitation code has reached maximum uses' };
      }

      return { valid: true, message: 'Invitation code is valid' };
    } catch (error) {
      console.error('Error verifying invitation code:', error);
      return { valid: false, message: 'Error verifying invitation code' };
    }
  }

  async useInvitationCode(code: string): Promise<{ success: boolean; message: string }> {
    try {
      // First get the current invitation code to check its current uses
      const [invitationCode] = await db
        .select()
        .from(invitationCodes)
        .where(eq(invitationCodes.code, code));

      if (!invitationCode) {
        return { success: false, message: 'Invitation code not found' };
      }

      // Update the invitation code usage
      const [updatedCode] = await db
        .update(invitationCodes)
        .set({
          currentUses: invitationCode.currentUses + 1,
        })
        .where(eq(invitationCodes.code, code))
        .returning();

      if (!updatedCode) {
        return { success: false, message: 'Failed to update invitation code' };
      }

      return { success: true, message: 'Invitation code used successfully' };
    } catch (error) {
      console.error('Error using invitation code:', error);
      return { success: false, message: 'Error using invitation code' };
    }
  }

  // Additional methods for database management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId));
    return result.changes > 0;
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