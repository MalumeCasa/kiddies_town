'use client'

import React from "react";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";

import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";

import { useState } from "react";
import { Select } from "@/components/FormElements/select";
import FormMutliSelectInput from "@/components/FormElements/MultiSelect";

export default function SingleStudentFormPage() {
    const parents = [
        { label: "John Doe", value: "123456" },
        { label: "Doe Joe", value: "654321" }
    ];

    const classes = [
        { label: "S1", value: "S1" },
        { label: "B2", value: "B2" }
    ];

    const streams = [
        { label: "Red", value: "Red" },
        { label: "Blue", value: "Blue" }
    ];

    const [selectParent, setSelectParent] = useState<any>(null);

    const [selectClass, setSelectClass] = useState<any>(null);

    const [selectStream, setSelectStream] = useState<any>(null);

    return (
        <>
            <Breadcrumb pageName="Add Single Student Form" />

            <div className="flex justify-end mb-6">
                <Link href="/dashboard/users/students/">
                    <Button label="Back" variant="dark" shape="rounded" size="small" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title="Single Student Form" className="space-y-5.5 !p-6.5">


                        <h2>Add Single Student</h2>
                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="SURNAME"
                                name="surname"
                                type="text"
                                placeholder="Enter last name"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="FIRST NAME/S"
                                name="first_names"
                                type="text"
                                placeholder="Enter first name(s)"
                                className="w-full xl:w-1/2"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="Preferred Name or Nick Name"
                                name="preferred_name"
                                type="text"
                                placeholder="Enter preferred/nick name(s)"
                                className="w-full xl:w-1/2"
                            />

                            <Select
                                label="Parent"
                                items={
                                    [{ label: "John Doe", value: "123456" },
                                    { label: "Doe Joe", value: "654321" }]
                                }
                                className="w-full xl:w-1/2"
                            />

                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <Select
                                label="GENDER"
                                placeholder="Select Gender"
                                className="w-full xl:w-1/2"
                                items={[
                                    { label: "MALE", value: "MALE" },
                                    { label: "FEMALE", value: "FEMALE" },
                                    { label: "OTHER", value: "OTHER" },
                                ]}
                            />

                            <InputGroup
                                label="DATE OF BIRTH"
                                type="date"
                                name="DOB"
                                placeholder="2000/02/02"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="NATIONAL ID/PASSPORT NO."
                                name="id_number"
                                type="text"
                                placeholder="150202935241"
                                className="w-full xl:w-1/2"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <Select
                                label="NATIONALITY"
                                placeholder="Select Nationality"
                                className="w-full xl:w-1/2"
                                items={[
                                    { label: "Black", value: "Black" },
                                    { label: "White", value: "White" },
                                    { label: "Asian", value: "Asian" },
                                    { label: "Hispanic", value: "Hispanic" },
                                    { label: "Other", value: "Other" }
                                ]}
                            />

                            <InputGroup
                                label="HOME ADDRESS"
                                name="home_address"
                                type="text"
                                placeholder="P.O. Box 12345-00100, Nairobi"
                                className="w-full xl:w-1/2"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <Select
                                label="Class"
                                items={classes}
                                value={selectClass}
                                onChange={setSelectClass}
                                className="w-full xl:w-1/2"
                            />

                            <Select
                                label="Stream"
                                items={streams}
                                value={selectStream}
                                onChange={setSelectStream}
                                className="w-full xl:w-1/2"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="ADMISSION NO."
                                name="admission_number"
                                type="text"
                                placeholder="ADM/001"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="ADMISSION DATE"
                                type="date"
                                name="admission_date"
                                placeholder="2023/02/02"
                                className="w-full xl:w-1/2"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="kiddiestown@gmail.com"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="password"
                                className="w-full xl:w-1/2"
                            />
                        </div>

                    </ShowcaseSection>
                </div >
            </div >
        </>
    )
}