// app/auth-actions.ts
'use server';

import { db } from "@api/db";
import { users, userSessions, staff, students, parents } from "@api/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { LoginCredentials, RegisterCredentials, AuthUser, UserType } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Login user
export async function login(credentials: LoginCredentials) {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    if (!user.isActive) {
      return { error: 'Account is deactivated' };
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return { error: 'Invalid email or password' };
    }

    // Get user details based on user type
    let userDetails: any = {};
    let fullName = '';
    
    switch (user.userType) {
      case 'staff':
        const [staffMember] = await db
          .select()
          .from(staff)
          .where(eq(staff.id, user.referenceId))
          .limit(1);
        
        if (staffMember) {
          userDetails = staffMember;
          fullName = `${staffMember.name} ${staffMember.surname}`;
        }
        break;
        
      case 'student':
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.id, user.referenceId))
          .limit(1);
        
        if (student) {
          userDetails = student;
          fullName = `${student.name} ${student.surname}`;
        }
        break;
        
      case 'parent':
        const [parent] = await db
          .select()
          .from(parents)
          .where(eq(parents.id, user.referenceId))
          .limit(1);
        
        if (parent) {
          userDetails = parent;
          fullName = `${parent.name} ${parent.surname}`;
        }
        break;
        
      case 'admin':
        // Admin is a type of staff
        const [admin] = await db
          .select()
          .from(staff)
          .where(eq(staff.id, user.referenceId))
          .limit(1);
        
        if (admin) {
          userDetails = admin;
          fullName = `${admin.name} ${admin.surname}`;
        }
        break;
    }

    // Generate token
    const token = generateToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session in database
    await db.insert(userSessions).values({
      userId: user.id,
      token,
      expiresAt: expiresAt.toISOString(),
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      userType: user.userType as UserType,
      referenceId: user.referenceId,
      name: fullName,
      role: userDetails.role || user.userType,
    };

    return {
      success: true,
      data: {
        user: authUser,
        token,
      },
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Failed to login' };
  }
}

// Register new user
export async function register(credentials: RegisterCredentials) {
  try {
    const { email, password, userType, referenceId } = credentials;

    // Validate input
    if (!email || !password || !userType || !referenceId) {
      return { error: 'All fields are required' };
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    // Verify reference exists based on user type
    let referenceExists = false;
    
    switch (userType) {
      case 'staff':
        const [staffMember] = await db
          .select()
          .from(staff)
          .where(eq(staff.id, referenceId))
          .limit(1);
        referenceExists = !!staffMember;
        break;
        
      case 'student':
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.id, referenceId))
          .limit(1);
        referenceExists = !!student;
        break;
        
      case 'parent':
        const [parent] = await db
          .select()
          .from(parents)
          .where(eq(parents.id, referenceId))
          .limit(1);
        referenceExists = !!parent;
        break;
    }

    if (!referenceExists) {
      return { error: 'Invalid reference ID' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        userType,
        referenceId,
        isActive: true,
        name: '',
      })
      .returning();

    return {
      success: true,
      data: newUser,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register' };
  }
}

// Logout user
export async function logout() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      // Delete session from database
      await db
        .delete(userSessions)
        .where(eq(userSessions.token, token));
    }

    // Clear cookie
    cookieStore.delete('auth_token');
    
    revalidatePath('/');
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return { user: null };
    }

    // Verify token
    let userId: number;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      userId = decoded.userId;
    } catch (error) {
      // Token is invalid or expired
      cookieStore.delete('auth_token');
      return { user: null };
    }

    // Check if session exists
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.token, token)
        )
      )
      .limit(1);

    if (!session) {
      cookieStore.delete('auth_token');
      return { user: null };
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await db
        .delete(userSessions)
        .where(eq(userSessions.id, session.id));
      cookieStore.delete('auth_token');
      return { user: null };
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.isActive) {
      cookieStore.delete('auth_token');
      return { user: null };
    }

    // Get user details based on user type
    let userDetails: any = {};
    let fullName = '';
    
    switch (user.userType) {
      case 'staff':
        const [staffMember] = await db
          .select()
          .from(staff)
          .where(eq(staff.id, user.referenceId))
          .limit(1);
        
        if (staffMember) {
          userDetails = staffMember;
          fullName = `${staffMember.name} ${staffMember.surname}`;
        }
        break;
        
      case 'student':
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.id, user.referenceId))
          .limit(1);
        
        if (student) {
          userDetails = student;
          fullName = `${student.name} ${student.surname}`;
        }
        break;
        
      case 'parent':
        const [parent] = await db
          .select()
          .from(parents)
          .where(eq(parents.id, user.referenceId))
          .limit(1);
        
        if (parent) {
          userDetails = parent;
          fullName = `${parent.name} ${parent.surname}`;
        }
        break;
        
      case 'admin':
        const [admin] = await db
          .select()
          .from(staff)
          .where(eq(staff.id, user.referenceId))
          .limit(1);
        
        if (admin) {
          userDetails = admin;
          fullName = `${admin.name} ${admin.surname}`;
        }
        break;
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      userType: user.userType as UserType,
      referenceId: user.referenceId,
      name: fullName,
      role: userDetails.role || user.userType,
      permissions: userDetails.permissions,
    };

    return {
      success: true,
      user: authUser,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null };
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const result = await getCurrentUser();
  return !!result.user;
}

// Require authentication middleware (for server components)
export async function requireAuth() {
  const result = await getCurrentUser();
  
  if (!result.user) {
    redirect('/login');
  }
  
  return result.user;
}

// Check user role/permissions
export async function hasPermission(user: AuthUser, requiredPermission: string): Promise<boolean> {
  if (user.userType === 'admin') {
    return true; // Admins have all permissions
  }
  
  // Check staff permissions
  if (user.userType === 'staff') {
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, user.referenceId))
      .limit(1);
    
    if (staffMember?.permissions) {
        return (staffMember.permissions as Record<string, boolean>)[requiredPermission] === true;
      }
  }
  
  return false;
}