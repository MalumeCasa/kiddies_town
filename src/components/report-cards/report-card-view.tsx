import type { ReportCard } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportCardViewProps {
  reportCard: ReportCard
}

export function ReportCardView({ reportCard }: ReportCardViewProps) {
  // Format date consistently for server and client
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}` // Fixed format: YYYY/MM/DD
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold">School Report Card</h1>
        <p className="text-muted-foreground mt-2">
          Academic Year {reportCard.academicYear} - Semester {reportCard.semester}
        </p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Student Name</p>
          <p className="font-semibold">{reportCard.studentName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
          <p className="font-semibold">{reportCard.rollNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Class</p>
          <p className="font-semibold">{reportCard.className}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Issued Date</p>
          {/* Use the fixed format function instead of toLocaleDateString */}
          <p className="font-semibold">{formatDate(reportCard.issuedDate)}</p>
        </div>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Subject</th>
                  <th className="text-center py-3 px-4 font-semibold">Marks</th>
                  <th className="text-center py-3 px-4 font-semibold">Total</th>
                  <th className="text-center py-3 px-4 font-semibold">Percentage</th>
                  <th className="text-center py-3 px-4 font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {reportCard.grades.map((grade) => (
                  <tr key={grade.subjectId} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{grade.subjectName}</td>
                    <td className="text-center py-3 px-4 font-medium">{grade.marks}</td>
                    <td className="text-center py-3 px-4">{grade.totalMarks}</td>
                    <td className="text-center py-3 px-4 font-medium">{grade.percentage}%</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Marks</p>
              <p className="text-3xl font-bold text-blue-700">{reportCard.totalMarks}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Percentage</p>
              <p className="text-3xl font-bold text-blue-700">{reportCard.totalPercentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Average</p>
              <p className="text-3xl font-bold text-blue-700">
                {(reportCard.totalMarks / reportCard.grades.length).toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher's Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{reportCard.remarks}</p>
        </CardContent>
      </Card>

      {/* Signatures */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-6">
        <div className="text-center space-y-8">
          <div className="h-16"></div>
          <p className="text-sm font-semibold border-t pt-2">{reportCard.teacherName}</p>
          <p className="text-xs text-muted-foreground">Class Teacher</p>
        </div>
        <div className="text-center space-y-8 md:col-span-1">
          <div className="h-16"></div>
          <p className="text-sm font-semibold border-t pt-2">{reportCard.principalName}</p>
          <p className="text-xs text-muted-foreground">Principal</p>
        </div>
      </div>
    </div>
  )
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "A+":
    case "A":
      return "bg-emerald-100 text-emerald-700"
    case "B+":
    case "B":
      return "bg-blue-100 text-blue-700"
    case "C":
      return "bg-yellow-100 text-yellow-700"
    case "D":
      return "bg-orange-100 text-orange-700"
    case "F":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}