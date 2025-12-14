import React from "react";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import type { Subject } from "@api/types";

interface ViewSubjectFormProps {
    subject: Subject;
}

export default function ViewSubjectForm({ subject }: ViewSubjectFormProps) {
    return (
        <>
            <Breadcrumb pageName="Subject Details" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title={`Subject Details - ${subject.name}`} className="space-y-5.5 !p-6.5">
                        {/* Header with Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
                                <p className="text-gray-600 mt-1">Taught by {subject.teacher}</p>
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
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Back to Subjects
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Basic Information */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoField label="Subject Name" value={subject.name} />
                                        <InfoField label="Teacher" value={subject.teacher} />
                                        <InfoField label="Schedule" value={subject.schedule} />
                                        <InfoField label="Duration" value={subject.duration} />
                                    </div>
                                </div>

                                {/* Topics */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Course Topics</h3>
                                    {subject.topics.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {subject.topics.map((topic, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm border border-blue-200"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No topics defined for this subject.</p>
                                    )}
                                </div>
                            </div>

                            {/* Assessments & Quick Info */}
                            <div className="space-y-6">
                                {/* Assessments */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Assessments</h3>
                                    {subject.assessments.length > 0 ? (
                                        <div className="space-y-3">
                                            {subject.assessments.map((assessment, index) => (
                                                <div key={index} className="bg-gray-50 p-3 rounded border">
                                                    <div className="font-medium text-gray-900">{assessment.type}</div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Date: {assessment.date}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No assessments scheduled.</p>
                                    )}
                                </div>

                                {/* Quick Info */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Info</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Topics:</span>
                                            <span className="text-sm font-medium">{subject.topics.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Assessments:</span>
                                            <span className="text-sm font-medium">{subject.assessments.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Duration:</span>
                                            <span className="text-sm font-medium">{subject.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Subject Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{subject.topics.length}</div>
                                    <div className="text-sm text-gray-600">Course Topics</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{subject.assessments.length}</div>
                                    <div className="text-sm text-gray-600">Assessments</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{subject.teacher}</div>
                                    <div className="text-sm text-gray-600">Instructor</div>
                                </div>
                            </div>
                        </div>
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
                {value}
            </div>
        </div>
    );
}