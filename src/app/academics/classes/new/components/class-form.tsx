"use client";

import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { createClassAndRedirect } from "@api/class-actions";
import { getAllTeachers } from "@api/actions";
import { Teacher } from '@api/types';
import { useRouter } from 'next/navigation';

export function NewClassForm() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
    const [newTeacherName, setNewTeacherName] = useState("");
    const [showNewTeacherInput, setShowNewTeacherInput] = useState(false);

    // Fetch teachers from database
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const result = await getAllTeachers();
                
                if (result?.success && Array.isArray(result.data)) {
                    setTeachers(result.data);
                } else {
                    setError("Failed to load teachers");
                }
            } catch (err) {
                console.error('Error fetching teachers:', err);
                setError("Error loading teachers list");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const handleTeacherSelect = (teacherName: string) => {
        if (selectedTeachers.includes(teacherName)) {
            // Remove if already selected
            setSelectedTeachers(prev => prev.filter(name => name !== teacherName));
        } else {
            // Add to selected teachers
            setSelectedTeachers(prev => [...prev, teacherName]);
        }
    };

    const handleAddNewTeacher = () => {
        if (newTeacherName.trim() && !selectedTeachers.includes(newTeacherName.trim())) {
            setSelectedTeachers(prev => [...prev, newTeacherName.trim()]);
            setNewTeacherName("");
            setShowNewTeacherInput(false);
        }
    };

    const handleRemoveTeacher = (teacherName: string) => {
        setSelectedTeachers(prev => prev.filter(name => name !== teacherName));
    };

    // Handle form submission with proper state management
    const handleFormSubmit = async (formData: FormData) => {
        setSubmitting(true);
        setError(null);

        try {
            // Remove the existing teachers from form data first (in case there are any)
            formData.delete('teachers');
            
            // Add selected teachers to form data as individual entries
            selectedTeachers.forEach(teacher => {
                formData.append('teachers', teacher);
            });

            console.log('Submitting teachers:', selectedTeachers); // Debug log

            // Submit the form
            const result = await createClassAndRedirect(formData);
            
            // If we get here, it means redirect didn't happen (error case)
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            console.error('Form submission error:', err);
            setError('Failed to create class. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ShowcaseSection title="Create New Class" className="space-y-5.5 !p-6.5">
            <form className="space-y-6" action={handleFormSubmit}>
                <InputGroup
                    label="CLASS NAME"
                    name="className"
                    type="text"
                    placeholder="Enter class name"
                    className="w-full xl:w-full"
                    required
                />

                <div className="flex flex-col">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                        CLASS SECTION *
                    </label>
                    <select
                        name="classSection"
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                    >
                        <option value="">Select class section</option>
                        <option value="NURSERY">Nursery</option>
                        <option value="PRIMARY">Primary</option>
                        <option value="SECONDARY">Secondary</option>
                    </select>
                </div>

                {/* Teachers Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-black dark:text-white">
                        TEACHERS *
                    </label>
                    
                    {/* Selected Teachers Display */}
                    {selectedTeachers.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-black dark:text-white mb-2">
                                Selected Teachers:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTeachers.map(teacher => (
                                    <div
                                        key={teacher}
                                        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{teacher}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTeacher(teacher)}
                                            className="text-primary hover:text-red-600 text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Teachers List */}
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-stroke rounded-lg p-3 dark:border-form-strokedark">
                        {loading ? (
                            <div className="text-sm text-gray-500">Loading teachers...</div>
                        ) : error ? (
                            <div className="text-sm text-red-500">{error}</div>
                        ) : teachers.length === 0 ? (
                            <div className="text-sm text-gray-500">No teachers found</div>
                        ) : (
                            teachers.map(teacher => {
                                const fullName = `${teacher.name} ${teacher.surname}`;
                                return (
                                    <div key={teacher.id} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id={`teacher-${teacher.id}`}
                                            checked={selectedTeachers.includes(fullName)}
                                            onChange={() => handleTeacherSelect(fullName)}
                                            className="rounded border-stroke text-primary focus:ring-primary dark:border-form-strokedark"
                                        />
                                        <label
                                            htmlFor={`teacher-${teacher.id}`}
                                            className="text-sm text-black dark:text-white cursor-pointer"
                                        >
                                            {fullName}
                                            {teacher.email && ` (${teacher.email})`}
                                        </label>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Add New Teacher */}
                    <div className="space-y-2">
                        {showNewTeacherInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTeacherName}
                                    onChange={(e) => setNewTeacherName(e.target.value)}
                                    placeholder="Enter new teacher name"
                                    className="flex-1 rounded-lg border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddNewTeacher}
                                    disabled={!newTeacherName.trim()}
                                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNewTeacherInput(false);
                                        setNewTeacherName("");
                                    }}
                                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowNewTeacherInput(true)}
                                className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1"
                            >
                                + Add New Teacher
                            </button>
                        )}
                    </div>
                </div>

                {/* REMOVED: Hidden input for teachers - we're handling this in the submit handler */}

                <InputGroup
                    label="SUBJECTS"
                    name="subjects"
                    type="text"
                    placeholder="Enter class subjects (comma separated)"
                    className="w-full xl:w-full"
                    required
                />

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={submitting}
                        className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={selectedTeachers.length === 0 || submitting}
                        className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating...
                            </>
                        ) : (
                            'Create Class'
                        )}
                    </button>
                </div>
            </form>
        </ShowcaseSection>
    );
}