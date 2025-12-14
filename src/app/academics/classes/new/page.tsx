import React from "react";
import Link from "next/link";

import { NewClassForm } from "./components/class-form";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Button } from "@/components/ui-elements/button";

import { DisplayClassesPage } from '../components/displayClasses';
import { getAllClasses } from '@api/class-actions';

import { getAllStaff } from '@api/staff-actions';


export const metadata: Metadata = {
    title: "New Class Page",
};

export default async function RegisterNewClassPage() {
    const classesResult = await getAllClasses() || { success: false, data: [] };
    const staff = await getAllStaff();
    return (
        <>
            <Breadcrumb pageName="New Class" />

            <div className="flex justify-end mb-6">
                <Link href="/dashboard/users/students/">
                    <Button label="Back" variant="dark" shape="rounded" size="small" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <NewClassForm />

                    <DisplayClassesPage
                        classes={classesResult.success ? classesResult.data : []}
                    />

                </div>
            </div>
        </>
    )
}