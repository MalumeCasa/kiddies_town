// Types for report card system
export interface Subject {
  id: string
  name: string
  code: string
}

export interface Grade {
  subjectId: string
  subjectName: string
  marks: number
  totalMarks: number
  percentage: number
  grade: string
}

export interface ReportCard {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  className: string
  semester: string
  academicYear: string
  grades: Grade[]
  totalMarks: number
  totalPercentage: number
  remarks: string
  teacherName: string
  principalName: string
  issuedDate: string
}
