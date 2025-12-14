import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui-elements/button";

import { FastUploadForm } from '../../_components/fast-upload-form'
import { DisplayStudentsPage } from "../../../_components/displayStudents";

export const metadata: Metadata = {
    title: "Fast Upload Students",
};

import { getStudents } from "@api/student-actions";

export default async function FastUploadStudentsPage() {
    const students = await getStudents();
    return (
        <>
            <Breadcrumb pageName="Fast Upload Students" />

            <div className="flex justify-end mb-6">
                <Link href="/dashboard/users/students/">
                    <Button label="Back" variant="dark" shape="rounded" size="small" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <FastUploadForm />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-10 mb-10">
                <div className="flex flex-col gap-9">
                    <DisplayStudentsPage students={students} />
                </div>
            </div>

        </>
    );
}