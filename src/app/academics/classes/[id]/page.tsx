// app/academics/classes/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getClassById, getAllClasses } from '@api/class-actions';
import { DisplayClassesPage } from "../components/displayClasses";
import { ShowcaseSection } from '@/components/Layouts/showcase-section';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import Link from 'next/link';

export default async function ViewClassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const [classResult, classesResult] = await Promise.all([
        getClassById(classId), // Use classId (the parsed integer) here
        getAllClasses()
    ]);

    if (!classResult.success || !classResult.data) {
        notFound();
    }

    const classData = classResult.data;

    return (
        <>
            <Breadcrumb pageName={`View Class: ${classData.className}`} />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-10 mb-10">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title="Class Details" className="space-y-5.5 !p-6.5">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Class: {classData.className} Details
                        </h2>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="CLASS ID"
                                name="id"
                                type="text"
                                placeholder={classData.id.toString()}
                                defaultValue={classData.id.toString()}
                                className="w-full xl:w-1/2"
                                disabled
                            />
                            <InputGroup
                                label="CLASS NAME"
                                name="className"
                                type="text"
                                placeholder={classData.className}
                                defaultValue={classData.className}
                                className="w-full xl:w-1/2"
                                disabled
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                TEACHERS
                            </label>
                            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-20">
                                <div className="flex flex-wrap gap-2">
                                    {classData.teachers && classData.teachers.length > 0 ? (
                                        classData.teachers.map((teacher: string, index: number) => (
                                            <span 
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            >
                                                {teacher}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">No teachers assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                SUBJECTS
                            </label>
                            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-20">
                                <div className="flex flex-wrap gap-2">
                                    {classData.subjects && classData.subjects.length > 0 ? (
                                        classData.subjects.map((subject: string, index: number) => (
                                            <span 
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            >
                                                {subject}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">No subjects assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Class ID: {classData.id}</p>
                                <p>Last updated: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={`/academics/classes/${classData.id}/edit`}
                                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Edit Class
                                </Link>
                                <Link
                                    href="/academics/classes"
                                    className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600 transition-colors"
                                >
                                    Back to Classes
                                </Link>
                            </div>
                        </div>
                    </ShowcaseSection>
                </div>
            </div>
            <DisplayClassesPage classes={classesResult.success ? classesResult.data : []} />
        </>
    );
}