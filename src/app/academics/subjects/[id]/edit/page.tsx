import React from "react";
import type { Metadata } from "next";

import { getSubjectById } from '@api/subject-actions';
import NewSubjectForm from '../../components/new-subject-form';

// For Next.js 14+ with App Router
interface EditSubjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: EditSubjectPageProps): Promise<Metadata> {
    // Await the params since they're now a Promise
    const { id } = await params;
    const subjectId = parseInt(id);
    const result = await getSubjectById(subjectId);

    if (!result.success) {
        return {
            title: "Subject Not Found",
        };
    }

    return {
        title: `Edit ${result.data.name} - School Management System`,
    };
}

export default async function EditSubjectPage({ params }: EditSubjectPageProps) {
    // Await the params since they're now a Promise
    const { id } = await params;
    const subjectId = parseInt(id);
    const result = await getSubjectById(subjectId);

    if (!result.success) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600">Subject not found</h1>
                <p className="mt-2">The requested subject does not exist.</p>
            </div>
        );
    }

    // Transform the data to match the Subject type if needed
    const subjectData = {
        ...result.data,
        updatedAt: result.data.updatedAt || undefined,
        createdAt: result.data.createdAt || undefined
    };

    return <NewSubjectForm subject={subjectData} isEdit={true} />;
}