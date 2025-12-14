import React from "react";
import Link from "next/link";

import { ExamForm } from "../components/exam-form";

import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Button } from "@/components/ui-elements/button";

export const metadata: Metadata = {
    title: "Create New Exam Page",
};

export default function CreateNewExam() {
    return (
        <>
            <Breadcrumb pageName="New Exam" />

            {/* BUTTONS */}
            <div className="flex justify-end mb-6 gap-3">
                <Link href="/academics/exams">
                    <Button
                        label="Cancel"
                        variant="outline"
                        shape="rounded"
                        size="small"
                        icon="←" // or use an actual icon component
                    />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ExamForm />
                </div>
            </div>

        </>
    )
}
