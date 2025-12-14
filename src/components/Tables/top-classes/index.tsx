"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compactFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";

interface ClassData {
  name: string;
  students: number;
  attendance: number;
  averageGrade: number;
  teacher: string;
}

interface TopClassesProps {
  data?: ClassData[];
  className?: string;
}

// Mock data for top classes
const mockClassData: ClassData[] = [
  { name: "Mathematics 10A", students: 32, attendance: 96.5, averageGrade: 88.2, teacher: "Mr. Wilson" },
  { name: "Science 9B", students: 28, attendance: 94.8, averageGrade: 85.7, teacher: "Mrs. Garcia" },
  { name: "English 11C", students: 30, attendance: 95.2, averageGrade: 82.4, teacher: "Mr. Brown" },
  { name: "History 10D", students: 25, attendance: 92.1, averageGrade: 79.8, teacher: "Mrs. Davis" },
  { name: "Physics 12A", students: 22, attendance: 97.3, averageGrade: 90.1, teacher: "Dr. Smith" },
];

export function TopClasses({ data = mockClassData, className }: TopClassesProps) {
  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Top Performing Classes
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">Class Name</TableHead>
            <TableHead>Students</TableHead>
            <TableHead className="!text-right">Attendance</TableHead>
            <TableHead>Avg Grade</TableHead>
            <TableHead>Teacher</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((classItem, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={classItem.name + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3 !text-left">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-sm font-semibold">
                    {classItem.name.charAt(0)}
                  </span>
                </div>
                <div className="">{classItem.name}</div>
              </TableCell>

              <TableCell>{compactFormat(classItem.students)}</TableCell>

              <TableCell className="!text-right text-green-light-1">
                {classItem.attendance}%
              </TableCell>

              <TableCell>{classItem.averageGrade}%</TableCell>

              <TableCell>{classItem.teacher}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}