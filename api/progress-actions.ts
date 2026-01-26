// lib/api/progress-actions.ts
'use server';

import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './db';
import { 
  curriculum, 
  curriculumChapters, 
  curriculumTopics, 
  curriculumProgress, 
  studentCurriculumProgress,
  classes,
  subjects
} from './db/schema';
import { revalidatePath } from 'next/cache';

/**
 * Get curriculum progress for a specific curriculum and class
 */
export async function getCurriculumProgress(curriculumId: number, classId?: number) {
  try {
    const whereConditions = [eq(curriculumProgress.curriculumId, curriculumId)];
    if (classId) {
      whereConditions.push(eq(curriculumProgress.classId, classId));
    }

    const progress = await db.query.curriculumProgress.findFirst({
      where: (curriculumProgress, { and }) => and(...whereConditions),
      with: {
        curriculum: {
          with: {
            class: true,
            subject: true
          }
        }
      }
    });
    
    if (!progress) {
      return { 
        success: true, 
        message: 'No progress found',
        progress: null 
      };
    }

    return { 
      success: true, 
      message: 'Progress retrieved successfully',
      progress 
    };
  } catch (error) {
    console.error('Error fetching curriculum progress:', error);
    return { 
      success: false, 
      error: 'Failed to fetch curriculum progress',
      progress: null 
    };
  }
}

/**
 * Get progress for all curricula in a class
 */
export async function getClassCurriculumProgress(classId: number) {
  try {
    const progressList = await db.query.curriculumProgress.findMany({
      where: eq(curriculumProgress.classId, classId),
      with: {
        curriculum: {
          with: {
            subject: true
          }
        }
      },
      orderBy: [desc(curriculumProgress.lastUpdated)]
    });

    return { 
      success: true, 
      message: 'Class curriculum progress retrieved successfully',
      progressList 
    };
  } catch (error) {
    console.error('Error fetching class curriculum progress:', error);
    return { 
      success: false, 
      error: 'Failed to fetch class curriculum progress',
      progressList: [] 
    };
  }
}

/**
 * Helper function to count total topics for a curriculum
 */
async function countTotalTopicsForCurriculum(curriculumId: number): Promise<number> {
  try {
    // First get all chapters for this curriculum
    const chapters = await db.query.curriculumChapters.findMany({
      where: eq(curriculumChapters.curriculumId, curriculumId)
    });

    // Then count topics for each chapter
    let totalTopics = 0;
    for (const chapter of chapters) {
      const topicCount = await db.$count(curriculumTopics, 
        eq(curriculumTopics.chapterId, chapter.id)
      );
      totalTopics += topicCount;
    }

    return totalTopics;
  } catch (error) {
    console.error('Error counting topics:', error);
    return 0;
  }
}

/**
 * Update curriculum progress
 */
export async function updateCurriculumProgress(
  curriculumId: number,
  classId: number,
  completedTopics: string[]
) {
  try {
    // First, check if curriculum exists
    const curriculumExists = await db.query.curriculum.findFirst({
      where: eq(curriculum.id, curriculumId)
    });

    if (!curriculumExists) {
      return { 
        success: false, 
        error: 'Curriculum not found' 
      };
    }

    // Count total topics for this curriculum
    const totalTopics = await countTotalTopicsForCurriculum(curriculumId);

    const progressPercentage = totalTopics > 0 
      ? Math.round((completedTopics.length / totalTopics) * 100)
      : 0;

    // Check if progress record exists
    const existingProgress = await db.query.curriculumProgress.findFirst({
      where: and(
        eq(curriculumProgress.curriculumId, curriculumId),
        eq(curriculumProgress.classId, classId)
      )
    });

    const now = new Date().toISOString();
    let updatedProgress;

    if (existingProgress) {
      // Update existing progress
      [updatedProgress] = await db.update(curriculumProgress)
        .set({
          completedTopics,
          progressPercentage,
          lastUpdated: now
        })
        .where(eq(curriculumProgress.id, existingProgress.id))
        .returning();
    } else {
      // Create new progress record
      [updatedProgress] = await db.insert(curriculumProgress)
        .values({
          curriculumId,
          classId,
          completedTopics,
          progressPercentage,
          lastUpdated: now
        })
        .returning();
    }

    // Revalidate relevant paths
    revalidatePath(`/academics/curriculum/${curriculumId}/progress`);
    revalidatePath('/academics/curriculum');

    return { 
      success: true, 
      message: 'Curriculum progress updated successfully',
      progress: updatedProgress 
    };
  } catch (error) {
    console.error('Error updating curriculum progress:', error);
    return { 
      success: false, 
      error: 'Failed to update curriculum progress: ' + 
        (error instanceof Error ? error.message : 'Unknown error') 
    };
  }
}

/**
 * Reset progress for a curriculum
 */
export async function resetCurriculumProgress(curriculumId: number, classId: number) {
  try {
    const existingProgress = await db.query.curriculumProgress.findFirst({
      where: and(
        eq(curriculumProgress.curriculumId, curriculumId),
        eq(curriculumProgress.classId, classId)
      )
    });

    if (!existingProgress) {
      return { 
        success: false, 
        error: 'No progress record found to reset' 
      };
    }

    await db.update(curriculumProgress)
      .set({
        completedTopics: [],
        progressPercentage: 0,
        lastUpdated: new Date().toISOString()
      })
      .where(eq(curriculumProgress.id, existingProgress.id));

    // Revalidate relevant paths
    revalidatePath(`/academics/curriculum/${curriculumId}/progress`);
    revalidatePath('/academics/curriculum');

    return { 
      success: true, 
      message: 'Curriculum progress reset successfully' 
    };
  } catch (error) {
    console.error('Error resetting curriculum progress:', error);
    return { 
      success: false, 
      error: 'Failed to reset curriculum progress' 
    };
  }
}

/**
 * Get progress statistics for a class
 */
export async function getClassProgressStats(classId: number) {
  try {
    // Get all curriculum progress for the class
    const classProgress = await db.query.curriculumProgress.findMany({
      where: eq(curriculumProgress.classId, classId),
      with: {
        curriculum: {
          with: {
            subject: true
          }
        }
      }
    });

    const stats = {
      totalCurricula: classProgress.length,
      averageProgress: classProgress.reduce((sum, item) => 
        sum + (item.progressPercentage || 0), 0) / (classProgress.length || 1),
      completedCurricula: classProgress.filter(item => item.progressPercentage === 100).length,
      inProgressCurricula: classProgress.filter(item => 
        (item.progressPercentage || 0) > 0 && (item.progressPercentage || 0) < 100).length,
      notStartedCurricula: classProgress.filter(item => 
        (item.progressPercentage || 0) === 0).length,
      bySubject: {} as Record<string, { count: number; avgProgress: number }>
    };

    // Calculate stats by subject
    classProgress.forEach(item => {
      const subjectName = item.curriculum?.subject?.name || 'Unknown';
      if (!stats.bySubject[subjectName]) {
        stats.bySubject[subjectName] = { count: 0, avgProgress: 0 };
      }
      stats.bySubject[subjectName].count++;
      stats.bySubject[subjectName].avgProgress += item.progressPercentage || 0;
    });

    // Calculate averages
    Object.keys(stats.bySubject).forEach(subject => {
      stats.bySubject[subject].avgProgress = Math.round(
        stats.bySubject[subject].avgProgress / stats.bySubject[subject].count
      );
    });

    return { 
      success: true, 
      message: 'Class progress stats retrieved successfully',
      stats 
    };
  } catch (error) {
    console.error('Error getting class progress stats:', error);
    return { 
      success: false, 
      error: 'Failed to get class progress stats',
      stats: null 
    };
  }
}

/**
 * Get student progress for a curriculum
 */
export async function getStudentCurriculumProgress(
  curriculumId: number,
  studentId: number
) {
  try {
    const studentProgress = await db.query.studentCurriculumProgress.findFirst({
      where: and(
        eq(studentCurriculumProgress.curriculumId, curriculumId),
        eq(studentCurriculumProgress.studentId, studentId)
      ),
      with: {
        student: true,
        curriculum: {
          with: {
            subject: true,
            class: true
          }
        }
      }
    });

    if (!studentProgress) {
      return { 
        success: true, 
        message: 'No student progress found',
        progress: null 
      };
    }

    return { 
      success: true, 
      message: 'Student curriculum progress retrieved successfully',
      progress: studentProgress 
    };
  } catch (error) {
    console.error('Error getting student curriculum progress:', error);
    return { 
      success: false, 
      error: 'Failed to get student curriculum progress',
      progress: null 
    };
  }
}

/**
 * Update student curriculum progress
 */
export async function updateStudentCurriculumProgress(
  studentId: number,
  curriculumId: number,
  completedTopics: string[]
) {
  try {
    // Check if curriculum exists
    const curriculumExists = await db.query.curriculum.findFirst({
      where: eq(curriculum.id, curriculumId)
    });

    if (!curriculumExists) {
      return { 
        success: false, 
        error: 'Curriculum not found' 
      };
    }

    // Count total topics for this curriculum
    const totalTopics = await countTotalTopicsForCurriculum(curriculumId);

    const progressPercentage = totalTopics > 0 
      ? Math.round((completedTopics.length / totalTopics) * 100)
      : 0;

    // Check if student progress exists
    const existingStudentProgress = await db.query.studentCurriculumProgress.findFirst({
      where: and(
        eq(studentCurriculumProgress.curriculumId, curriculumId),
        eq(studentCurriculumProgress.studentId, studentId)
      )
    });

    const now = new Date().toISOString();
    let updatedProgress;

    if (existingStudentProgress) {
      // Update existing student progress
      [updatedProgress] = await db.update(studentCurriculumProgress)
        .set({
          completedTopics,
          progressPercentage,
          lastUpdated: now
        })
        .where(eq(studentCurriculumProgress.id, existingStudentProgress.id))
        .returning();
    } else {
      // Create new student progress record
      [updatedProgress] = await db.insert(studentCurriculumProgress)
        .values({
          studentId,
          curriculumId,
          completedTopics,
          progressPercentage,
          lastUpdated: now
        })
        .returning();
    }

    // Revalidate relevant paths
    revalidatePath(`/students/${studentId}/progress`);
    revalidatePath(`/academics/curriculum/${curriculumId}/progress`);

    return { 
      success: true, 
      message: 'Student curriculum progress updated successfully',
      progress: updatedProgress 
    };
  } catch (error) {
    console.error('Error updating student curriculum progress:', error);
    return { 
      success: false, 
      error: 'Failed to update student curriculum progress: ' + 
        (error instanceof Error ? error.message : 'Unknown error') 
    };
  }
}

// Types for better type safety (optional but recommended)
export interface ProgressStats {
  totalCurricula: number;
  averageProgress: number;
  completedCurricula: number;
  inProgressCurricula: number;
  notStartedCurricula: number;
  bySubject: Record<string, { count: number; avgProgress: number }>;
}