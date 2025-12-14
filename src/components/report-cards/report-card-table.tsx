import type { ReportCard } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ReportCardTableProps {
  reportCards: ReportCard[]
}

export function ReportCardTable({ reportCards }: ReportCardTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Roll No.</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Total Marks</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium">{card.rollNumber}</TableCell>
              <TableCell>{card.studentName}</TableCell>
              <TableCell>{card.className}</TableCell>
              <TableCell>{card.totalMarks}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{card.totalPercentage}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${card.totalPercentage}%` }} />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/academics/report-cards/${card.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/academics/report-cards/${card.id}/print`}>
                    <Button variant="outline" size="sm">
                      Print
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
