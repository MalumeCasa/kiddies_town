import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, GraduationCap, Calendar, Award } from "lucide-react"

type Student = {
  id: number
  student_id: string
  name: string
  surname: string
  email: string
  major: string | null
  year: string | null
  gpa: number | null
  enrollment_date: string
}

export function StudentCard({ student }: { student: Student }) {
  const getYearColor = (year: string | null) => {
    switch (year) {
      case "Freshman":
        return "bg-green-100 text-green-800 border-green-200"
      case "Sophomore":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Junior":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Senior":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getGPAColor = (gpa: number | null) => {
    if (!gpa) return "text-gray-600"
    if (gpa >= 3.8) return "text-green-600 font-semibold"
    if (gpa >= 3.5) return "text-blue-600 font-semibold"
    if (gpa >= 3.0) return "text-purple-600"
    return "text-gray-600"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              {student.name} {student.surname}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">ID: {student.student_id}</p>
          </div>
          {student.year && (
            <Badge variant="outline" className={getYearColor(student.year)}>
              {student.year}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
            {student.email}
          </a>
        </div>
        {student.major && (
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{student.major}</span>
          </div>
        )}
        {student.gpa && (
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>GPA: </span>
            <span className={getGPAColor(student.gpa)}>{Number(student.gpa).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
