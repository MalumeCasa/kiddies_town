// app/types.ts
export type UserType = 'staff' | 'student' | 'parent' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  userType: UserType;
  referenceId: number;
  name?: string;
  role?: string;
  permissions?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  userType: UserType;
  referenceId: number;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

// Export all existing types
export * from '../db/types';