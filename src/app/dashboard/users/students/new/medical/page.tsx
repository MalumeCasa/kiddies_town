"use client"

import React from "react";
import Link from "next/link";

import MedicalForm from "../_components/medical-form";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui-elements/button";

export default function MedicalConsentPage() {
    return (
        <>
            <Breadcrumb pageName="Medical Consent Form" />

            {/* BUTTONS */}
            <div className="flex justify-end mb-6 gap-3">
                <Link href="/dashboard/users/students/new/">
                    <Button
                        label="Back"
                        variant="outline"
                        shape="rounded"
                        size="small"
                        icon="←" // or use an actual icon component
                    />
                </Link>

                <Link href="/dashboard/users/students/new/agreement/">
                    <Button
                        label="Next"
                        variant="green"
                        shape="rounded"
                        size="small"
                        icon="" // or use an actual icon component
                    />
                </Link>

                <Link href="/dashboard/users/students/new/agreement/">
                    <Button
                        label="Cancel"
                        variant="dark"
                        shape="rounded"
                        size="small"
                        icon="x" // or use an actual icon component
                    />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <MedicalForm />
                </div>
            </div>
        </>
    )
}
