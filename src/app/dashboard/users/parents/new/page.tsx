import React from "react";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";

import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { Button as UIButton } from "@/components/ui/button";

import { Select } from "@/components/FormElements/select";

//Add Meta data
export const metadata: Metadata = {
    title: "Add Parent Form",
    description: "Add Parent Form",
}

export default function AddParentFormPage() {
    return (
        <>
            <Breadcrumb pageName="Add Parent Form" />

            <div className="flex justify-end mb-6">
                <Link href="/dashboard/users/parents/">
                    <Button label="Cancel" variant="dark" shape="rounded" size="small" />
                </Link>
            </div>

            <form action="" method="post">
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                    <div className="flex flex-col gap-9">
                        <ShowcaseSection title="Add Parent" className="space-y-5.5 !p-6.5">
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                {/* Add Title Select */}
                                <Select
                                    label="TITLE"
                                    placeholder="Select Title"
                                    className="w-full xl:w-1/2"
                                    items={[
                                        { label: "Mr", value: "Mr" },
                                        { label: "Mrs", value: "Mrs" },
                                        { label: "Ms", value: "Ms" },
                                        { label: "Dr", value: "Dr" },
                                        { label: "Prof", value: "Prof" }
                                    ]}
                                />

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
                                {/*Add Select Relationship*/}
                                <Select
                                    label="RELATIONSHIP"
                                    placeholder="Select Relationship"
                                    className="w-full xl:w-1/2"
                                    items={[
                                        { label: "Father", value: "Father" },
                                        { label: "Mother", value: "Mother" },
                                        { label: "Guardian", value: "Guardian" },
                                        { label: "Aunt", value: "Aunt" },
                                        { label: "Uncle", value: "Uncle" }
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
                                    label="NATIONAL ID/PASSPORT NUMBER"
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
                                <Select
                                    label="MARITAL STATUS"
                                    placeholder="Select Marital Status"
                                    className="w-full xl:w-1/2"
                                    items={[
                                        { label: "SINGLE", value: "SINGLE" },
                                        { label: "MARRIED", value: "MARRIED" },
                                        { label: "DIVORCED", value: "DIVORCED" },
                                        { label: "WIDOWED", value: "WIDOWED" },
                                        { label: "SEPARATED", value: "SEPARATED" },
                                    ]}
                                />

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
                            </div>

                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                <InputGroup
                                    label="OCCUPATION"
                                    name="Occupation"
                                    type="text"
                                    placeholder="Occupation"
                                    className="w-full xl:w-1/2"
                                />

                                <InputGroup
                                    label="RELIGION"
                                    name="religion"
                                    type="text"
                                    placeholder="Christianity, Islam, Hinduism, etc."
                                    className="w-full xl:w-1/2"
                                />
                            </div>
                        </ShowcaseSection>
                    </div >


                    <ShowcaseSection title="Contact Details" className="space-y-5.5 !p-6.5">
                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="MOBILE NUMBER"
                                name="mobile_number"
                                type="text"
                                placeholder="+254 712 345 678"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="HOME TEL. NUMBER"
                                name="home_tel_number"
                                type="text"
                                placeholder="+254 712 345 678"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="WORKPLACE CONTACT NUMBER"
                                name="workplace_contact_number"
                                type="text"
                                placeholder="+254 712 345 678"
                                className="w-full xl:w-1/2"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <InputGroup
                                label="RESIDENTIAL ADDRESS"
                                name="residential_address"
                                type="text"
                                placeholder="123 Main St, City, Country"
                                className="w-full xl:w-1/2"
                            />

                            <InputGroup
                                label="WORKPLACE ADDRESS"
                                name="workplace_address"
                                type="text"
                                placeholder="456 Corporate Ave, City, Country"
                                className="w-full xl:w-1/2"
                            />
                        </div>
                    </ShowcaseSection>

                    <ShowcaseSection title="Login Details" className="space-y-5.5 !p-6.5">
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

                        <Link
                            href="/dashboard/users/parents"
                            className=""
                        >
                            <UIButton
                                variant="ghost"
                                size="lg"
                            >
                                Cancel
                            </UIButton>
                        </Link>

                        <Button
                            label="Add Parent"
                            variant="dark"
                            shape={"rounded"}
                            size={"small"}
                        />
                    </ShowcaseSection>

                </div >
            </form>

        </>
    )
}