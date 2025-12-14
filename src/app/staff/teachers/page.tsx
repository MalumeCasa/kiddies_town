// This is now a Next.js Server Component
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

import { getAllTeachers } from '@api/teacher-actions'
import { DisplayTeacherPage } from '../components/displayTeachers';

export const metadata: Metadata = {
    title: "Staff Page",
};

export default async function StaffDirectoryPage() {
    // Fetch data directly in the Server Component
    const teachersResult = await getAllTeachers();
    
    // Handle the API response properly
    const staff = teachersResult?.success ? teachersResult.data : [];

    return (
        <>
            <Breadcrumb pageName="Staff Directory" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title="Staff Directory" className="space-y-5.5 !p-6.5">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Total Staff Members: {staff.length}
                                </p>
                            </div>
                        </div>
                    </ShowcaseSection>

                    <DisplayTeacherPage staff={staff} />
                </div>
            </div>
        </>
    );
}