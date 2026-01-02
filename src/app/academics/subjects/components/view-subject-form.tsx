import React from "react";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import type { Subject } from "@api/types";
// Assuming you have components like Badge, Card, etc.
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, FileText } from "lucide-react";


interface ViewSubjectFormProps {
    subject: Subject;
}

export default function ViewSubjectForm({ subject }: ViewSubjectFormProps) {
    // Safely extract and format values, providing 'N/A' for nulls
    const subjectName = subject.name ?? 'Subject Name';
    const teacherName = subject.teacher ?? 'N/A';
    const className = subject.className ?? 'N/A';
    const classSection = subject.classSection ?? 'N/A';
    const schedule = subject.schedule ?? 'N/A';
    const duration = subject.duration ?? 'N/A';
    
    // Use optional chaining with nullish coalescing for arrays
    const topics = subject.topics ?? [];
    const assessments = subject.assessments ?? [];

    return (
        <>
            <Breadcrumb pageName="Subject Details" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title={`Subject Details - ${subjectName}`} className="space-y-5.5 !p-6.5">
                        {/* Header with Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{subjectName}</h1>
                                <p className="text-gray-600 mt-1">Taught by {teacherName}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/academics/subjects/${subject.id}/edit`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Edit Subject
                                </Link>
                                <Link
                                    href="/academics/subjects"
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    Back to List
                                </Link>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <Card className="shadow-lg border-l-4 border-blue-500">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <BookOpen className="h-6 w-6 text-blue-500" />
                                    <div>
                                        <div className="text-lg font-bold">{topics.length}</div>
                                        <div className="text-sm text-gray-600">Total Topics</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-lg border-l-4 border-green-500">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <FileText className="h-6 w-6 text-green-500" />
                                    <div>
                                        <div className="text-lg font-bold">{assessments.length}</div>
                                        <div className="text-sm text-gray-600">Assessments</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-lg border-l-4 border-purple-500">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Users className="h-6 w-6 text-purple-500" />
                                    <div>
                                        <div className="text-lg font-bold">{teacherName}</div>
                                        <div className="text-sm text-gray-600">Instructor</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-lg border-l-4 border-yellow-500">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Clock className="h-6 w-6 text-yellow-500" />
                                    <div>
                                        <div className="text-lg font-bold">{duration}</div>
                                        <div className="text-sm text-gray-600">Duration</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoField label="Class Name" value={className} />
                            <InfoField label="Class Section" value={classSection} />
                            <InfoField label="Scheduled Time" value={schedule} />
                            <InfoField label="Duration Per Session" value={duration} />
                        </div>

                        {/* Topics Section */}
                        <Card className="mt-8">
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Topics Covered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {topics.length > 0 ? (
                                        // Fix: topics is guaranteed to be an array here
                                        topics.map((topic, index) => (
                                            <Badge key={index} variant="secondary">{topic}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No topics defined for this subject.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Assessments Section */}
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Assessments</h3>
                                <div className="space-y-3">
                                    {assessments.length > 0 ? (
                                        // Fix: assessments is guaranteed to be an array here
                                        assessments.map((assessment, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                                                <span className="font-medium">{assessment.type}</span>
                                                <span className="text-sm text-gray-500">{assessment.date}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No assessments scheduled for this subject.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                    </ShowcaseSection>
                </div>
            </div>
        </>
    );
}

// Helper component for displaying information fields
function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <div className="text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[42px] flex items-center">
                {/* The value is already guaranteed to be a string here due to nullish coalescing above */}
                {value}
            </div>
        </div>
    );
}