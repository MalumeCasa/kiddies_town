// types.ts - Complete type definitions for the application

// ===== DATABASE TYPES =====
// These match your database schema

// types.ts - Complete type definitions for the application

// ===== DATABASE TYPES =====
// These match your database schema

export type Student = {
  id: number | string;
  name: string;
  surname: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  attendance?: string | null | number;
  class?: string | null;
};

export type Teacher = {
  id: number | string;
  name: string | null;
  surname: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  subjects: string[] | null;
  experience: number | null;
  qualification: string | null;
  staffId: number | null;
  classRole?: string | null;
  // FIX: Allow classes to be an array of strings (class names) OR Class objects
  classes?: Class[] | string[]; 
  classIds?: number[];
};

export type Subject = {
  id: number | string;
  name: string | null;
  teacher: string | null;
  schedule: string | null;
  duration: string | null;
  topics: string[] | null;
  assessments: Array<{ type: string; date: string }> | null;
  className: string | null;
  classSection: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  // Add missing properties
  classId?: number | null;
  teacherIds: number[] | string[] | null ;
  teacherNames: string[] | null;
};

export type Class = {
  id: number | string;
  className: string | null;
  classSection: string | null;
  teachers: string[] | null;
  subjects: string[] | null;
  classTeacher?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

export type ClassActivity = {
  id: number | string;
  title: string;
  date: string;
  className?: string | null;
};

// ===== UI STATE TYPES =====
// For component state management

export type LoadingState = {
  isLoading: boolean;
  error: string | null;
};

export type SelectionState = {
  selectedItems: string[] | number[];
  allSelected: boolean;
};

export type FormState = {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
};

// ===== FILTER TYPES =====
// For data filtering

export type ClassFilter = {
  section?: string;
  teacher?: string;
  subject?: string;
};

export type StudentFilter = {
  class?: string;
  attendance?: string;
  searchQuery?: string;
};

export type TeacherFilter = {
  subject?: string;
  role?: string;
  searchQuery?: string;
};

export interface ClassData {
  students: number;
  subjects: number;
  teacher: string;
  activities: ClassActivity[];
}

export interface ClassSection {
  name: string;
  classes: string[];
}

export type ActiveView = "overview" | "students" | "teachers" | "subjects";

export interface EditingClass {
  section: string;
  index: number;
}

// utils/curriculum-types.ts
export interface TableCurriculum {
  id: number;
  title: string;
  description?: string;
  academicYear: string;
  status: string;
  className: string;
  subjectName: string;
  classId: number;
  subjectId: number;
  chapters: any[];
  createdAt: string;
}

export function isTableCurriculum(cur: any): cur is TableCurriculum {
  return (
    cur &&
    typeof cur.id === 'number' &&
    typeof cur.title === 'string' &&
    typeof cur.academicYear === 'string' &&
    typeof cur.status === 'string' &&
    typeof cur.className === 'string' &&
    typeof cur.subjectName === 'string' &&
    typeof cur.classId === 'number' &&
    typeof cur.subjectId === 'number' &&
    Array.isArray(cur.chapters) &&
    typeof cur.createdAt === 'string'
  );
}

export function transformToTableCurriculum(cur: any): TableCurriculum {
  return {
    id: cur.id,
    title: cur.title,
    description: cur.description ?? undefined,
    academicYear: cur.academicYear,
    status: cur.status ?? 'draft',
    className: cur.className ?? 'Not assigned',
    subjectName: cur.subjectName ?? 'Not assigned',
    classId: cur.classId,
    subjectId: cur.subjectId,
    chapters: cur.chapters ?? [],
    createdAt: cur.createdAt ?? new Date().toISOString(),
  };
}

// lib/api/db/types.ts - Add these types
export interface Curriculum {
	id: number;
	classId: number;
	subjectId: number;
	title: string;
	description?: string;
	academicYear: string;
	status: 'draft' | 'published' | 'archived';
	totalTopics?: number;
	totalDuration?: number;
	createdAt?: string;
	updatedAt?: string;
	// Relations
	className?: string;
	subjectName?: string;
	chapters?: Chapter[];
}

export interface Chapter {
	id: number;
	curriculumId: number;
	chapterNumber: number;
	title: string;
	description?: string;
	order: number;
	duration?: number;
	createdAt?: string;
	// Relations
	topics?: Topic[];
}

export interface Topic {
	id: number; // Change from string to number to match serial primary key
	chapterId: number;
	topicNumber: number;
	title: string;
	description?: string;
	order: number;
	duration?: string;
	learningObjectives?: string[];
	resources?: string[];
	isCore?: boolean;
	createdAt?: string;
}

export interface CurriculumProgress {
	id: number;
	curriculumId: number;
	classId: number;
	completedTopics: string[] | null; // Array of topic IDs as strings
	progressPercentage: number | null;
	lastUpdated: string | null;
	createdAt?: string;
}

export interface StudentCurriculumProgress {
	id: number;
	studentId: number;
	curriculumId: number;
	completedTopics: string[] | null;
	progressPercentage: number | null;
	lastUpdated: string | null;
	createdAt?: string;
}