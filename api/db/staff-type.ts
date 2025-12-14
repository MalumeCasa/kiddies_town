import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { staff } from './schema';

// Original Drizzle type (with number id)
export type DbStaff = InferSelectModel<typeof staff>;

// Frontend type (with string id)
export type Staff = Omit<DbStaff, 'id'> & { id: string | number };

export type InsertStaff = InferInsertModel<typeof staff>;

export type StaffRole = 
  | 'principal' 
  | 'vice principal' 
  | 'head of department' 
  | 'teacher' 
  | 'administrator' 
  | 'support staff' 
  | 'accountant' 
  | 'librarian' 
  | string;

export type EmploymentType = 
  | 'full-time' 
  | 'part-time' 
  | 'contract' 
  | 'temporary' 
  | string;

export type Department = 
  | 'administration' 
  | 'academic' 
  | 'support' 
  | 'finance' 
  | 'library' 
  | string;
