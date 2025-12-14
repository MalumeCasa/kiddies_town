// app/actions.ts - Main export file that re-exports all actions

// Re-export all student actions
export { 
  createStudent,
  createStudentWithDetails,
  getStudents,
  getStudentNames,
  getStudentDetailsEmails,
  getStudentById,
  updateStudent,
  updateStudentWithDetails,
  deleteStudent,
  exportStudents
} from './student-actions';

// Re-export all class actions
export { 
  getAllClasses, 
  getClassById, 
  createClass, 
  updateClass, 
  deleteClass,
  searchClasses,
  getClassesWithStudentCount,
  exportClasses
} from './class-actions';

// Re-export teacher and subject getters from class-actions
export { 
  getAllTeachers,
  getAllSubjects 
} from './class-actions';

// Re-export all teacher actions (for teacher-specific operations)
export { 
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  searchTeachers
} from './teacher-actions';

// Re-export all subject actions (for subject-specific operations)
export { 
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  searchSubjects,
  getAllTeachersForSubjects,
  getTeachersByIds
} from './subject-actions';

export { 
  createParent,
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
  searchParents,
  getParentNames,
  addStudentToParent,
  removeStudentFromParent,
  getParentsByStudentId
} from './parent-actions';

/*
export {
  markAttendance,
  markClassAttendance,
  getAttendanceRecords,
  getTodaysClassAttendance,
  getMonthlyAttendanceReport,
  getAttendanceStats,
  updateAttendance,
  deleteAttendance,
  getStudentsByClass,
  getClasses
} from './attendance-actions';
*/
// Export parent types
export type { Parent, NewParent, ParentWithRelations } from './parent-actions';

/*
export type {
  AttendanceRecord,
  NewAttendanceRecord,
  AttendanceSummary,
  AttendanceFilters
} from './attendance-actions';
 */