import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

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

type Students = {
    id: number
    name: string
    surname: string | null
    email: string | null
    phone: string | null
    address: string | null
    attendance: string | null
}

// Correctly define the union type using the `|` operator
export function StudentTable({ students }: { students: (Student | Students)[] }) {
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
  
  // A custom type guard function to check if a student is of type 'Student'
  function isStudentType(student: Student | Students): student is Student {
    return 'student_id' in student;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Major</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="text-right">GPA</TableHead>
            <TableHead>Enrolled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              {/* Conditionally render based on the object type */}
              {isStudentType(student) ? (
                <>
                  <TableCell className="font-medium">{student.student_id}</TableCell>
                  <TableCell>
                    {student.name} {student.surname}
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                      {student.email}
                    </a>
                  </TableCell>
                  <TableCell>{student.major || "—"}</TableCell>
                  <TableCell>
                    {student.year ? (
                      <Badge variant="outline" className={getYearColor(student.year)}>
                        {student.year}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {student.gpa ? <span className={getGPAColor(student.gpa)}>{Number(student.gpa).toFixed(2)}</span> : "—"}
                  </TableCell>
                  <TableCell>{new Date(student.enrollment_date).toLocaleDateString()}</TableCell>
                </>
              ) : (
                <>
                  <TableCell className="font-medium">—</TableCell>
                  <TableCell>
                    {student.name} {student.surname || ""}
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                      {student.email || "—"}
                    </a>
                  </TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell className="text-right">—</TableCell>
                  <TableCell>—</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
