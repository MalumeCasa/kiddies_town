"use client";

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteStudent, exportStudents } from "@api/student-actions";
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  Braces,
  Edit3, 
  Eye, 
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Display Students",
};

interface ExportButtonsProps {
  students: any[];
  selectedStudents?: string[];
}

// Client component for export functionality
function ExportButtons({ students, selectedStudents = [] }: ExportButtonsProps) {
  const hasSelected = selectedStudents.length > 0;
  const dataToExport = hasSelected 
    ? students.filter(student => selectedStudents.includes(student.id))
    : students;

  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    try {
      // Call server action to get export data
      const result = await exportStudents(dataToExport, format);
      
      if (result) {
        // Client-side download
        const blob = new Blob([result.data], { type: result.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(`Export failed:`, error);
      // Add toast notification here if needed
      alert('Export failed. Please try again.');
    }
  };

  const exportOptions = [
    { format: 'json' as const, label: 'JSON', icon: Braces, color: 'text-purple-600 dark:text-purple-400' },
    { format: 'csv' as const, label: 'CSV', icon: FileText, color: 'text-green-600 dark:text-green-400' },
    { format: 'xlsx' as const, label: 'Excel', icon: TableIcon, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Export Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Download className="w-4 h-4" />
        <span>Export Data</span>
        {hasSelected && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
            {selectedStudents.length} selected
          </span>
        )}
      </div>

      {/* Export All Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {exportOptions.map(({ format, label, icon: Icon, color }) => (
          <Button
            key={format}
            onClick={() => handleExport(format)}
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="font-medium">
              {hasSelected ? `Selected ${label}` : `All ${label}`}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

// Client component wrapper
export function DisplayStudentsPage(studentsParam?: { students: any[] }) {
  const students = studentsParam ? studentsParam.students : [];
  const [selectedStudents, setSelectedStudents] = React.useState<string[]>([]);

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(
      selectedStudents.length === students.length 
        ? [] 
        : students.map(student => student.id)
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-6 mb-6">
        <div className="flex flex-col gap-6">
          <ShowcaseSection 
            title="Student Management" 
            className="space-y-6 !p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm"
          >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Directory</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage and export student information
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">TOTAL STUDENTS</div>
                </div>
                {selectedStudents.length > 0 && (
                  <div className="px-3 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {selectedStudents.length} selected
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Buttons */}
            <ExportButtons 
              students={students} 
              selectedStudents={selectedStudents} 
            />

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                    <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                      <TableHead className="w-12 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={students.length > 0 && selectedStudents.length === students.length}
                            onChange={selectAllStudents}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:checked:bg-blue-500"
                          />
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4">Student ID</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4">Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4">Surname</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4">Email</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4">Phone</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4">Address</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white py-4 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow 
                        key={student.id} 
                        className={`transition-colors duration-200 ${
                          index % 2 === 0 
                            ? 'bg-white dark:bg-gray-800' 
                            : 'bg-gray-50/50 dark:bg-gray-700/50'
                        } hover:bg-blue-50/30 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700`}
                      >
                        <TableCell className="py-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:checked:bg-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium text-gray-900 dark:text-white py-4">
                          #{student.id}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white py-4">
                          {student.name}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white py-4">
                          {student.surname}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                              {student.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {student.phone || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                              {student.address || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center gap-3">
                            <Link 
                              href={`/dashboard/users/students/${student.id}/edit`}
                              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </Link>
                            <Link 
                              href={`/dashboard/users/students/${student.id}`}
                              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-200"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </Link>
                            <form action={deleteStudent.bind(null, student.id)} className="inline">
                              <button 
                                type="submit" 
                                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {students.map((student) => (
                <div 
                  key={student.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-xs hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-5 h-5 mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:checked:bg-blue-500"
                      />
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {student.name} {student.surname}
                        </h3>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          ID: {student.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{student.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 flex-1">{student.address || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link 
                      href={`/dashboard/users/students/${student.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
                    <Link 
                      href={`/dashboard/users/students/${student.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-200 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <form action={deleteStudent.bind(null, student.id)} className="inline">
                      <button 
                        type="submit" 
                        className="flex items-center gap-2 px-4 py-2 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {students.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No students found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding some students to your database.</p>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                  Add First Student
                </Button>
              </div>
            )}
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
