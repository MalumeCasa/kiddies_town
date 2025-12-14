// app/actions/curriculum-actions.ts
'use server';

import { db } from '@api/db';
import { classes, curriculum, curriculumProgress, subjects } from '@api/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { Chapter }  from './db/types';

export async function createCurriculum(data: {
  classId: number;
  subjectId: number;
  title: string;
  description?: string;
  academicYear: string;
  chapters: Chapter[];
}) {
  try {
    const [newCurriculum] = await db.insert(curriculum).values(data).returning();
    revalidatePath('/academics/curriculum');
    return { success: true, data: newCurriculum };
  } catch (error) {
    console.error('Error creating curriculum:', error);
    return { success: false, error: 'Failed to create curriculum' };
  }
}

export async function getCurriculums() {
  try {
    const curriculums = await db
      .select({
        id: curriculum.id,
        title: curriculum.title,
        description: curriculum.description,
        academicYear: curriculum.academicYear,
        status: curriculum.status,
        classId: curriculum.classId,
        subjectId: curriculum.subjectId,
        className: classes.className,
        subjectName: subjects.name,
        chapters: curriculum.chapters,
        createdAt: curriculum.createdAt,
      })
      .from(curriculum)
      .leftJoin(classes, eq(curriculum.classId, classes.id))
      .leftJoin(subjects, eq(curriculum.subjectId, subjects.id))
      .orderBy(desc(curriculum.createdAt));

    return { success: true, data: curriculums };
  } catch (error) {
    console.error('Error fetching curriculums:', error);
    return { success: false, error: 'Failed to fetch curriculums' };
  }
}

export async function getCurriculumProgress(curriculumId: number, classId: number) {
    try {
      const [progress] = await db
        .select()
        .from(curriculumProgress)
        .where(
          and(
            eq(curriculumProgress.curriculumId, curriculumId),
            eq(curriculumProgress.classId, classId)
          )
        );
  
      return { success: true, data: progress || null };
    } catch (error) {
      console.error('Error fetching curriculum progress:', error);
      return { success: false, error: 'Failed to fetch progress' };
    }
  }

export async function getCurriculumById(id: number) {
  try {
    const [curriculumData] = await db
      .select({
        id: curriculum.id,
        title: curriculum.title,
        description: curriculum.description,
        academicYear: curriculum.academicYear,
        status: curriculum.status,
        classId: curriculum.classId,
        subjectId: curriculum.subjectId,
        className: classes.className,
        subjectName: subjects.name,
        chapters: curriculum.chapters,
        createdAt: curriculum.createdAt,
        updatedAt: curriculum.updatedAt,
      })
      .from(curriculum)
      .leftJoin(classes, eq(curriculum.classId, classes.id))
      .leftJoin(subjects, eq(curriculum.subjectId, subjects.id))
      .where(eq(curriculum.id, id));

    if (!curriculumData) {
      return { success: false, error: 'Curriculum not found' };
    }

    return { success: true, data: curriculumData };
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    return { success: false, error: 'Failed to fetch curriculum' };
  }
}

export async function updateCurriculum(id: number, data: Partial<typeof curriculum.$inferInsert>) {
  try {
    const [updatedCurriculum] = await db
      .update(curriculum)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(curriculum.id, id))
      .returning();

    revalidatePath('/academics/curriculum');
    return { success: true, data: updatedCurriculum };
  } catch (error) {
    console.error('Error updating curriculum:', error);
    return { success: false, error: 'Failed to update curriculum' };
  }
}

export async function deleteCurriculum(id: number) {
  try {
    await db.delete(curriculum).where(eq(curriculum.id, id));
    revalidatePath('/academics/curriculum');
    return { success: true };
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    return { success: false, error: 'Failed to delete curriculum' };
  }
}

export async function updateCurriculumProgress(
  curriculumId: number,
  classId: number,
  completedTopics: string[]
) {
  try {
    // Get total topics count from curriculum
    const [curriculumData] = await db
      .select({ chapters: curriculum.chapters })
      .from(curriculum)
      .where(eq(curriculum.id, curriculumId));

    if (!curriculumData) {
      return { success: false, error: 'Curriculum not found' };
    }

    // Calculate total topics
    const totalTopics = curriculumData.chapters?.reduce((total, chapter) => 
      total + (chapter.topics?.length || 0), 0) || 0;

    const progressPercentage = totalTopics > 0 
      ? Math.round((completedTopics.length / totalTopics) * 100)
      : 0;

    const [progressRecord] = await db
      .insert(curriculumProgress)
      .values({
        curriculumId,
        classId,
        completedTopics,
        progressPercentage,
      })
      .onConflictDoUpdate({
        target: [curriculumProgress.curriculumId, curriculumProgress.classId],
        set: {
          completedTopics,
          progressPercentage,
          lastUpdated: new Date().toISOString(),
        },
      })
      .returning();

    revalidatePath('/academics/curriculum');
    return { success: true, data: progressRecord };
  } catch (error) {
    console.error('Error updating curriculum progress:', error);
    return { success: false, error: 'Failed to update progress' };
  }
}