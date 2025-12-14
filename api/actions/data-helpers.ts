// app/actions/data-helpers.ts
'use server';

import { db } from '@api/db';
import { teachers, classes, subjects, teacherClasses, subjectClasses } from '@api/db/schema';
import { eq, and } from 'drizzle-orm';

// Get teachers with their classes
export async function getTeachersWithClasses() {
  try {
    const teachersWithClasses = await db
      .select({
        teacher: teachers,
        classes: classes,
      })
      .from(teachers)
      .leftJoin(teacherClasses, eq(teachers.id, teacherClasses.teacherId))
      .leftJoin(classes, eq(teacherClasses.classId, classes.id));

    // Group classes by teacher
    const grouped = teachersWithClasses.reduce((acc, row) => {
      if (!acc[row.teacher.id]) {
        acc[row.teacher.id] = {
          ...row.teacher,
          classes: [],
        };
      }
      if (row.classes) {
        acc[row.teacher.id].classes.push(row.classes);
      }
      return acc;
    }, {} as Record<number, any>);

    return Object.values(grouped);
  } catch (error) {
    console.error('Error fetching teachers with classes:', error);
    return [];
  }
}

// Get subjects with their classes
export async function getSubjectsWithClasses() {
  try {
    const subjectsWithClasses = await db
      .select({
        subject: subjects,
        class: classes,
      })
      .from(subjects)
      .leftJoin(subjectClasses, eq(subjects.id, subjectClasses.subjectId))
      .leftJoin(classes, eq(subjectClasses.classId, classes.id));

    // Group classes by subject
    const grouped = subjectsWithClasses.reduce((acc, row) => {
      if (!acc[row.subject.id]) {
        acc[row.subject.id] = {
          ...row.subject,
          classes: [],
          classId: undefined, // Will be set based on selection
        };
      }
      if (row.class) {
        acc[row.subject.id].classes.push(row.class);
      }
      return acc;
    }, {} as Record<number, any>);

    return Object.values(grouped);
  } catch (error) {
    console.error('Error fetching subjects with classes:', error);
    return [];
  }
}

// Get subjects by class
export async function getSubjectsByClass(classId: number) {
  try {
    const subjectsByClass = await db
      .select({
        subject: subjects,
      })
      .from(subjects)
      .innerJoin(subjectClasses, eq(subjects.id, subjectClasses.subjectId))
      .where(eq(subjectClasses.classId, classId));

    return subjectsByClass.map(row => row.subject);
  } catch (error) {
    console.error('Error fetching subjects by class:', error);
    return [];
  }
}

// Get teachers by class
export async function getTeachersByClass(classId: number) {
  try {
    const teachersByClass = await db
      .select({
        teacher: teachers,
      })
      .from(teachers)
      .innerJoin(teacherClasses, eq(teachers.id, teacherClasses.teacherId))
      .where(eq(teacherClasses.classId, classId));

    return teachersByClass.map(row => row.teacher);
  } catch (error) {
    console.error('Error fetching teachers by class:', error);
    return [];
  }
}