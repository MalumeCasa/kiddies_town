"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Input from "@/components/FormElements/InputGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, Calendar, Users, BookOpen, ClipboardList, Trash2, Edit, Eye, X, ChevronDown, Table as TableIcon, BarChart3, LayoutGrid } from "lucide-react";
import type { Subject } from "@api/types";
import { deleteSubject } from "@api/subject-actions";

interface DisplaySubjectsPageProps {
  subjects?: Subject[];
}

export function DisplaySubjectsPage({ subjects = [] }: DisplaySubjectsPageProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'cards' | 'stats'>('table');
  const [showStats, setShowStats] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fix hydration by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const selectAllSubjects = () => {
    setSelectedSubjects(
      selectedSubjects.length === filteredSubjects.length
        ? []
        : filteredSubjects.map(subject => subject.id.toString())
    );
  };

  // Delete function
  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(subjectId);
    try {
      const result = await deleteSubject(parseInt(subjectId));
      if (result.success) {
        window.location.reload();
      } else {
        alert(`Failed to delete subject: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('An error occurred while deleting subject');
    } finally {
      setIsDeleting(null);
    }
  };

  // Filter subjects
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.schedule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.className && subject.className.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (subject.classSection && subject.classSection.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTeacher = filterTeacher === "all" || subject.teacher === filterTeacher;
    const matchesClass = filterClass === "all" || subject.className === filterClass;
    const matchesSection = filterSection === "all" || subject.classSection === filterSection;

    return matchesSearch && matchesTeacher && matchesClass && matchesSection;
  });

  // Get unique teachers for filter
  const teachers = [...new Set(subjects.map(s => s.teacher))];

  // Get unique classes for filter - with null safety
  const classes = [...new Set(subjects.map(s => s.className).filter((className): className is string =>
    className !== null && className !== undefined && className !== ''
  ))];

  // Get unique sections for filter - with null safety
  const sections = [...new Set(subjects.map(s => s.classSection).filter((section): section is string =>
    section !== null && section !== undefined && section !== ''
  ))];

  // Pagination
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + itemsPerPage);

  // Export functionality
  const ExportButtons = ({ subjects, selectedSubjects }: { subjects: Subject[], selectedSubjects: string[] }) => {
    const exportSubjects = (subjectsToExport: Subject[]) => {
      if (subjectsToExport.length === 0) {
        alert('No subjects to export');
        return;
      }

      const data = subjectsToExport.map(subject => ({
        'ID': subject.id,
        'Name': subject.name,
        'Class': subject.className || 'Not assigned',
        'Section': subject.classSection || 'Not specified',
        'Teacher': subject.teacher,
        'Schedule': subject.schedule,
        'Duration': subject.duration,
        'Topics': subject.topics.join(', '),
        'Assessments': subject.assessments.map(a => `${a.type} (${a.date})`).join('; ')
      }));

      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subjects-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    const handleExportSelected = () => {
      const subjectsToExport = subjects.filter(s => selectedSubjects.includes(s.id.toString()));
      exportSubjects(subjectsToExport);
    };

    const handleExportAll = () => {
      exportSubjects(subjects);
    };

    return (
      <div className="flex gap-2">
        <Button
          onClick={handleExportAll}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export All
        </Button>
        {selectedSubjects.length > 0 && (
          <Button
            onClick={handleExportSelected}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Selected ({selectedSubjects.length})
          </Button>
        )}
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Parse schedule for better display
  const parseScheduleForDisplay = (schedule: string) => {
    return schedule.split(';').map(part => part.trim()).filter(part => part).join('\n');
  };

  // Get section badge color - with null safety
  const getSectionBadgeColor = (section: string | null | undefined) => {
    const sectionLower = (section || '').toLowerCase();
    switch (sectionLower) {
      case 'primary':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'secondary':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'nursery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get section display text - with null safety
  const getSectionDisplayText = (section: string | null | undefined) => {
    if (!section) return 'Not specified';
    return section.charAt(0).toUpperCase() + section.slice(1);
  };

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'table' as const, name: 'Table View', icon: TableIcon },
          { id: 'cards' as const, name: 'Card View', icon: LayoutGrid },
          { id: 'stats' as const, name: 'Statistics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1); // Reset to first page when changing tabs
            }}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );

  // Compact Card View Component - FIXED to be responsive
  const CompactCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {paginatedSubjects.map((subject) => (
        <Card key={subject.id} className="hover:shadow-lg transition-shadow max-w-full">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{subject.name}</h3>
                <p className="text-xs text-gray-500 mt-1">ID: {subject.id}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedSubjects.includes(subject.id.toString())}
                onChange={() => toggleSubjectSelection(subject.id.toString())}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 flex-shrink-0 ml-2"
              />
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Teacher:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                  {subject.teacher}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <Badge variant="secondary" className="text-xs">
                  {subject.className || 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section:</span>
                <Badge className={`text-xs ${getSectionBadgeColor(subject.classSection)}`}>
                  {getSectionDisplayText(subject.classSection)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schedule:</span>
                <span className="text-right text-xs font-mono max-w-[120px] truncate">
                  {subject.schedule.split(';')[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                  {subject.duration}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <Link
                href={`/academics/subjects/${subject.id}/edit`}
                className="flex-1 text-center text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Link>
              <Link
                href={`/academics/subjects/${subject.id}`}
                className="flex-1 text-center text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Link>
              <button
                onClick={() => handleDeleteSubject(subject.id.toString(), subject.name)}
                disabled={isDeleting === subject.id.toString()}
                className="flex-1 text-center text-red-600 hover:text-red-800 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                {isDeleting === subject.id.toString() ? '...' : 'Delete'}
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Pagination Component
  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSubjects.length)} of {filteredSubjects.length}
        </span>
      </div>
      
      <div className="flex gap-1 flex-wrap justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(1)}
        >
          First
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="px-3 py-2 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(totalPages)}
        >
          Last
        </Button>
      </div>
    </div>
  );

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-6">
          <ShowcaseSection title="Subjects Management" className="space-y-6 !p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects Directory</h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage all subjects, schedules, and academic information in one place
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Link
            href="/calendar"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            View Calendar
          </Link>
          <Link
            href="/academics/subjects/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add New Subject
          </Link>
        </div>
      </div>

      {/* Stats Cards - Collapsible */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 text-gray-600"
          >
            {showStats ? 'Hide Statistics' : 'Show Statistics'}
            <ChevronDown className={`h-4 w-4 transition-transform ${showStats ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{subjects.length}</p>
                    <p className="text-xs text-blue-700 font-medium">Total Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{teachers.length}</p>
                    <p className="text-xs text-green-700 font-medium">Teachers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-900">{classes.length}</p>
                    <p className="text-xs text-indigo-700 font-medium">Classes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{sections.length}</p>
                    <p className="text-xs text-purple-700 font-medium">Sections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-900">
                      {subjects.reduce((acc, subject) => acc + subject.topics.length, 0)}
                    </p>
                    <p className="text-xs text-orange-700 font-medium">Total Topics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-900">
                      {subjects.reduce((acc, subject) => acc + subject.assessments.length, 0)}
                    </p>
                    <p className="text-xs text-red-700 font-medium">Assessments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Filters and Search Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing: {filteredSubjects.length} of {subjects.length}</span>
              {selectedSubjects.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {selectedSubjects.length} selected
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search subjects, teachers, classes, schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher
              </label>
              <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Teachers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <Select
                value={filterClass}
                onValueChange={setFilterClass}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(className => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>
                      {getSectionDisplayText(section)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterTeacher("all");
                  setFilterClass("all");
                  setFilterSection("all");
                  setSelectedSubjects([]);
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={!searchTerm && filterTeacher === "all" && filterClass === "all" && filterSection === "all"}
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t">
            <ExportButtons
              subjects={filteredSubjects}
              selectedSubjects={selectedSubjects}
            />

            {selectedSubjects.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedSubjects.length} subjects? This action cannot be undone.`)) {
                    // Implement bulk delete
                    alert(`Bulk delete functionality for ${selectedSubjects.length} subjects would be implemented here`);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedSubjects.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <Card>
        <CardContent className="p-6">
          {activeTab === 'table' && (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={filteredSubjects.length > 0 && selectedSubjects.length === filteredSubjects.length}
                            onChange={selectAllSubjects}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[150px]">Subject</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[100px]">Class</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[100px]">Section</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[120px]">Teacher</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[150px]">Schedule</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[100px]">Duration</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[150px]">Topics</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[150px]">Assessments</TableHead>
                        <TableHead className="font-semibold text-gray-900 min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubjects.length > 0 ? (
                        paginatedSubjects.map((subject) => (
                          <TableRow key={subject.id} className="hover:bg-gray-50 transition-colors border-b">
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedSubjects.includes(subject.id.toString())}
                                onChange={() => toggleSubjectSelection(subject.id.toString())}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-900">{subject.name}</div>
                                <div className="text-xs text-gray-500 mt-1">ID: {subject.id}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {subject.className ? (
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                                  {subject.className}
                                </Badge>
                              ) : (
                                <span className="text-xs text-gray-400">Not assigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={`border ${getSectionBadgeColor(subject.classSection)}`}>
                                {getSectionDisplayText(subject.classSection)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {subject.teacher}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="text-sm whitespace-pre-line leading-relaxed font-mono text-gray-700">
                                  {parseScheduleForDisplay(subject.schedule)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {subject.duration}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {subject.topics.slice(0, 3).map((topic, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                                    {topic}
                                  </Badge>
                                ))}
                                {subject.topics.length > 3 && (
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    +{subject.topics.length - 3}
                                  </Badge>
                                )}
                                {subject.topics.length === 0 && (
                                  <span className="text-xs text-gray-400">No topics</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 max-w-xs">
                                {subject.assessments.slice(0, 2).map((assessment, index) => (
                                  <div key={index} className="flex items-center gap-1">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs flex-1 truncate">
                                      {assessment.type}
                                    </Badge>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {formatDate(assessment.date)}
                                    </span>
                                  </div>
                                ))}
                                {subject.assessments.length > 2 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    +{subject.assessments.length - 2} more
                                  </div>
                                )}
                                {subject.assessments.length === 0 && (
                                  <span className="text-xs text-gray-400">No assessments</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Link
                                  href={`/academics/subjects/${subject.id}/edit`}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Link>
                                <Link
                                  href={`/academics/subjects/${subject.id}`}
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors text-sm font-medium"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Link>
                                <button
                                  onClick={() => handleDeleteSubject(subject.id.toString(), subject.name)}
                                  disabled={isDeleting === subject.id.toString()}
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {isDeleting === subject.id.toString() ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-12">
                            <div className="flex flex-col items-center gap-3 text-gray-500">
                              <BookOpen className="h-12 w-12 text-gray-300" />
                              <div>
                                <p className="font-medium text-gray-900">No subjects found</p>
                                {subjects.length === 0 ? (
                                  <p className="text-sm mt-1">
                                    Get started by{" "}
                                    <Link href="/academics/subjects/new" className="text-blue-600 hover:underline font-medium">
                                      adding your first subject
                                    </Link>
                                  </p>
                                ) : (
                                  <p className="text-sm mt-1">
                                    No subjects match your current filters.{" "}
                                    <button
                                      onClick={() => {
                                        setSearchTerm("");
                                        setFilterTeacher("all");
                                        setFilterClass("all");
                                        setFilterSection("all");
                                      }}
                                      className="text-blue-600 hover:underline font-medium"
                                    >
                                      Clear filters
                                    </button>
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <Pagination />
            </>
          )}
          
          {activeTab === 'cards' && (
            <>
              <CompactCardView />
              <Pagination />
            </>
          )}
          
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Section Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    Section Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sections.map(section => {
                      const sectionCount = subjects.filter(s => s.classSection === section).length;
                      const sectionPercentage = subjects.length > 0 ? ((sectionCount / subjects.length) * 100) : 0;

                      return (
                        <div key={section} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${section === 'primary' ? 'bg-blue-500' :
                              section === 'secondary' ? 'bg-green-500' :
                                'bg-purple-500'
                              }`} />
                            <span className="font-medium capitalize text-gray-700">{section}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${section === 'primary' ? 'bg-blue-500' :
                                  section === 'secondary' ? 'bg-green-500' :
                                    'bg-purple-500'
                                  }`}
                                style={{ width: `${sectionPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-12 text-right">
                              {sectionCount} ({sectionPercentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Calendar Integration */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Calendar Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    All subject schedules are automatically synced to the collective calendar for easy tracking and management.
                  </p>
                  <Link
                    href="/calendar"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    View Full Calendar
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}