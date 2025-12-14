// app/(dashboard)/fees/students/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  Eye,
  Send,
  Download
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your database
const studentFees = [
  {
    id: "1",
    studentId: "STU001",
    name: "John Doe",
    class: "Grade 1",
    totalFee: 1200,
    paid: 1200,
    pending: 0,
    status: "Paid",
    dueDate: "2024-02-01"
  },
  {
    id: "2",
    studentId: "STU002",
    name: "Jane Smith",
    class: "Grade 2",
    totalFee: 1500,
    paid: 1000,
    pending: 500,
    status: "Partial",
    dueDate: "2024-02-01"
  },
  {
    id: "3",
    studentId: "STU003",
    name: "Mike Johnson",
    class: "Grade 1",
    totalFee: 1200,
    paid: 0,
    pending: 1200,
    status: "Pending",
    dueDate: "2024-02-01"
  }
];

export default function StudentFeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStudents = studentFees.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(student => 
    statusFilter === "all" || student.status === statusFilter
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid": return "default";
      case "Partial": return "secondary";
      case "Pending": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Fees</h1>
          <p className="text-muted-foreground">
            View and manage student fee records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentFees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {studentFees.filter(s => s.status === "Paid").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {studentFees.filter(s => s.status !== "Paid").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
              <Button variant="outline" size="md">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Fee Records</CardTitle>
          <CardDescription>
            View individual student fee payments and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{student.name}</h3>
                    <Badge variant={getStatusVariant(student.status)}>
                      {student.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>ID: {student.studentId}</span>
                    <span>Class: {student.class}</span>
                    <span>Due: {student.dueDate}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>Total: ${student.totalFee}</span>
                    <span className="text-green-600">Paid: ${student.paid}</span>
                    <span className="text-orange-600">Pending: ${student.pending}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Link href={`dashboard/fees/students/${student.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                  <Button size="sm">
                    <Link href={`/dashboard/fees/payments?action=create&studentId=${student.id}`}>
                      Record Payment
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}