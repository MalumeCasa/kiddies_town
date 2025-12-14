// components/edit-class-form.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { updateClass } from "@api/class-actions";
import { useRouter } from "next/navigation";

interface Class {
    id: number;
    className: string;
    teachers: string[];
    subjects: string[];
    classSection?: string;
}

interface Teacher {
    id: number;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    role?: string;
}

interface Subject {
    id: number;
    name: string;
}

interface EditClassFormProps {
    classData: Class;
    availableTeachers: Teacher[];
    availableSubjects: Subject[];
}

export default function EditClassForm({ 
    classData, 
    availableTeachers, 
    availableSubjects 
}: EditClassFormProps) {
    const router = useRouter();
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(classData.subjects || []);
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>(classData.teachers || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubjectChange = (subjectName: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedSubjects(prev => [...prev, subjectName]);
        } else {
            setSelectedSubjects(prev => prev.filter(name => name !== subjectName));
        }
    };

    const handleTeacherChange = (teacherName: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedTeachers(prev => [...prev, teacherName]);
        } else {
            setSelectedTeachers(prev => prev.filter(name => name !== teacherName));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const className = formData.get('className') as string;

            // Prepare the data object for updateClass
            const updatedData = {
                className,
                teachers: selectedTeachers,
                subjects: selectedSubjects,
                classSection: classData.classSection || '' // Make sure classSection is included
            };

            console.log('Submitting data:', updatedData);

            const result = await updateClass(classData.id, updatedData);

            if (result.success) {
                alert('Class updated successfully!');
                router.push('/academics/classes');
                router.refresh();
            } else {
                alert(result.error || 'Failed to update class');
            }
        } catch (error) {
            console.error('Error updating class:', error);
            alert('An error occurred while updating the class');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Edit Class" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title={`Edit ${classData.className}`} className="space-y-5.5 !p-6.5">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="mb-4.5">
                                <InputGroup
                                    label="CLASS NAME"
                                    name="className"
                                    type="text"
                                    placeholder={classData.className}
                                    defaultValue={classData.className}
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Hidden input for classSection to ensure it's included */}
                            <input type="hidden" name="classSection" value={classData.classSection || ''} />

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    TEACHERS
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-300 rounded-lg">
                                    {availableTeachers.length > 0 ? (
                                        availableTeachers.map((teacher: Teacher) => {
                                            const fullName = `${teacher.name} ${teacher.surname}`;
                                            const isChecked = selectedTeachers.includes(fullName);
                                            
                                            return (
                                                <label key={teacher.id} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        name="teachers"
                                                        value={fullName}
                                                        checked={isChecked}
                                                        onChange={(e) => handleTeacherChange(fullName, e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {fullName}
                                                        {teacher.email && (
                                                            <span className="block text-xs text-gray-500">
                                                                {teacher.email}
                                                            </span>
                                                        )}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 col-span-2">No teachers available</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    SUBJECTS
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-300 rounded-lg">
                                    {availableSubjects.length > 0 ? (
                                        availableSubjects.map((subject: Subject) => {
                                            const isChecked = selectedSubjects.includes(subject.name);
                                            
                                            return (
                                                <label key={subject.id} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        name="subjects"
                                                        value={subject.name}
                                                        checked={isChecked}
                                                        onChange={(e) => handleSubjectChange(subject.name, e.target.checked)}
                                                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{subject.name}</span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 col-span-2">No subjects available</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link
                                    href="/academics/classes"
                                    className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Class'}
                                </button>
                            </div>
                        </form>
                    </ShowcaseSection>
                </div>
            </div>
        </>
    );
}