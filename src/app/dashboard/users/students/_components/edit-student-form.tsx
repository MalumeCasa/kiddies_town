import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

import InputGroup from "@/components/FormElements/InputGroup";
import { updateStudentWithDetails } from "@api/student-actions";

// Define the shape of the student prop
interface Student {
    id: number;
    surname: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    attendance: string | null;
}

// Accept the student object as a prop
export default function EditStudentForm({ student }: { student: Student }) {
    // Now you can render the form with the fetched student data.
    return (
        <>
            <Breadcrumb pageName="Edit Students" />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title={`Edit ${student.name} ${student.surname}`} className="space-y-5.5 !p-6.5">
                        <form className="space-y-6" action={updateStudentWithDetails.bind(null, student.id)}>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="SURNAME"
                                    name="surname"
                                    type="text"
                                    placeholder={""+student.surname}
                                    defaultValue={""+student.surname}
                                    className="w-full xl:w-1/2"
                                />
                                <InputGroup
                                    label="FIRST NAME/S"
                                    name="name"
                                    type="text"
                                    placeholder={""+student.name}
                                    defaultValue={""+student.name}
                                    className="w-full xl:w-1/2"
                                />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder={""+student.email}
                                    defaultValue={""+student.email}
                                    className="w-full xl:w-1/2"
                                    required
                                />
                                <InputGroup
                                    label="PHONE NUMBER"
                                    name="phone"
                                    type="text"
                                    placeholder={""+student.phone}
                                    defaultValue={""+student.phone}
                                    className="w-full xl:w-1/2"
                                />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="ADDRESS"
                                    name="address"
                                    type="text"
                                    placeholder={""+student.address}
                                    defaultValue={""+student.address}
                                    className="w-full xl:w-3/4"
                                />
                                <InputGroup
                                    label="ATTENDANCE"
                                    name="attendance"
                                    type="text"
                                    placeholder={""+student.attendance}
                                    defaultValue={""+student.attendance}
                                    className="mb-4.5"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
                                >
                                    Update Student
                                </button>
                            </div>
                        </form>
                    </ShowcaseSection>
                </div>
            </div>
        </>
    );
}
