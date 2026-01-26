// app/actions/curriculum-actions.ts
'use server';

import { db } from '@api/db';
import { classes, curriculum, curriculumProgress, subjects } from '@api/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { Chapter } from './db/types'; // Assuming this defines the shape of chapters

// ----------------------------------------------------------------------
// CORRECTED INTERFACE
// ----------------------------------------------------------------------
export interface TransformedCurriculum {
  id: number;
  title: string;
  description: string | null | undefined; // This was the previous type mismatch
  academicYear: string;
  status: string | null;
  className: string | null;
  subjectName: string | null;
  classId: number;
  subjectId: number;
  chapters: any[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}



// ----------------------------------------------------------------------
// ACTIONS
// ----------------------------------------------------------------------

export async function createCurriculum(data: {
  classId: number;
  subjectId: number;
  title: string;
  description?: string;
  academicYear: string;
  chapters: Chapter[];
}) {
  try {
    // NOTE: Insertion of complex relations is often handled separately.
    const [newCurriculum] = await db.insert(curriculum).values(data as any).returning();
    revalidatePath('/academics/curriculum');
    return { success: true, data: newCurriculum };
  } catch (error) {
    console.error('Error creating curriculum:', error);
    return { success: false, error: 'Failed to create curriculum' };
  }
}

// FIX: Updated getCurriculums to include updatedAt in select and flatten data
export async function getCurriculums() {
  try {
    // 1. Fetch data using Drizzle Query API
    const curriculums = await db.query.curriculum.findMany({
      orderBy: desc(curriculum.createdAt),
      with: {
        // Renamed 'class' and 'subject' relations must be present for flattening
        class: {
          columns: { className: true }
        },
        subject: {
          columns: { name: true }
        },
        chapters: {
          with: {
            topics: true, // Assuming a topics relation exists on chapters
          }
        }
      },
      columns: {
        id: true,
        title: true,
        description: true,
        academicYear: true,
        status: true,
        classId: true,
        subjectId: true,
        createdAt: true,
        updatedAt: true, // FIX: Include the required 'updatedAt' column
      }
    });

    // 2. Map and transform the result to match the flat TransformedCurriculum interface
    const transformedCurriculums = curriculums.map(cur => {
      // Destructure to separate nested relations from base columns
      const { class: classData, subject: subjectData, ...restCurriculum } = cur;

      return {
        ...restCurriculum, // Base curriculum columns (including updatedAt)
        className: classData.className ?? null,
        subjectName: subjectData.name ?? null,
        // Ensure chapters is returned as null if the array is empty or non-existent
        chapters: restCurriculum.chapters?.length ? restCurriculum.chapters : null,
      } as TransformedCurriculum;
    });

    return { success: true, data: transformedCurriculums };
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

    return { success: true, progress: progress || null };
  } catch (error) {
    console.error('Error fetching curriculum progress:', error);
    return { success: false, error: 'Failed to fetch progress' };
  }
}

// FIX: Updated getCurriculumById to ensure consistency
export async function getCurriculumById(id: number) {
  try {
    const curriculumData = await db.query.curriculum.findFirst({
      where: eq(curriculum.id, id),
      with: {
        class: {
          columns: { className: true }
        },
        subject: {
          columns: { name: true }
        },
        chapters: {
          with: {
            topics: true,
          }
        }
      },
      columns: {
        id: true,
        title: true,
        description: true,
        academicYear: true,
        status: true,
        classId: true,
        subjectId: true,
        createdAt: true,
        updatedAt: true, // FIX: Include updatedAt for consistency
      }
    });

    if (!curriculumData) {
      return { success: false, error: 'Curriculum not found' };
    }

    // Map and transform the result to match the flat TransformedCurriculum interface
    const { class: classData, subject: subjectData, ...restCurriculum } = curriculumData;

    const transformedData: TransformedCurriculum = {
      ...restCurriculum,
      className: classData.className ?? null,
      subjectName: subjectData.name ?? null,
      chapters: restCurriculum.chapters?.length ? restCurriculum.chapters : null,
    };

    return { success: true, data: transformedData };
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
    // 1. Fetch curriculum data including the chapters relation
    const curriculumData = await db.query.curriculum.findFirst({
      where: eq(curriculum.id, curriculumId),
      with: {
        chapters: {
          with: {
            topics: true
          }
        }
      },
      columns: {
        id: true // only need to fetch the ID to prevent Drizzle type issues, and relations
      }
    });

    if (!curriculumData) {
      return { success: false, error: 'Curriculum not found' };
    }

    // 2. Calculate total topics
    // chapters will be available as an array on curriculumData
    const totalTopics = curriculumData.chapters?.reduce((total, chapter) =>
      total + (chapter.topics?.length || 0), 0) || 0;

    const progressPercentage = totalTopics > 0
      ? Math.round((completedTopics.length / totalTopics) * 100)
      : 0;

    // 3. Update/Insert progress
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

// NOTE: This function is now redundant as getCurriculums is fixed to return the transformed data.
export async function getTransformedCurriculums(): Promise<{
  success: boolean;
  data: TransformedCurriculum[] | null; // Returns Array or null
  error?: string;
}> {
  try {
    const result = await getCurriculums();

    if (!result.success || !result.data) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching transformed curriculums:', error);
    return { success: false, error: 'Failed to fetch curriculums', data: null };
  }
}