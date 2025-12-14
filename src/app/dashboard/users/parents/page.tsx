import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";

// Add Meta data
export const metadata: Metadata = {
    title: "Parents List",
    description: "List of all parents",
};

// Dummy data for parents
const parents = [
    {
        id: 1,
        title: "Mr",
        surname: "Smith",
        firstNames: "John",
        relationship: "Father",
        mobile: "+254 712 345 678",
        email: "john.smith@gmail.com",
    },
    {
        id: 2,
        title: "Mrs",
        surname: "Doe",
        firstNames: "Jane",
        relationship: "Mother",
        mobile: "+254 722 111 222",
        email: "jane.doe@gmail.com",
    },
    {
        id: 3,
        title: "Ms",
        surname: "Brown",
        firstNames: "Emily",
        relationship: "Guardian",
        mobile: "+254 733 444 555",
        email: "emily.brown@gmail.com",
    },
];

export default function ParentsListPage() {
    return (
        <>
            <Breadcrumb pageName="Parents List" />

            <div className="flex justify-end mb-6">
                <Link href="/dashboard/users/parents/new">
                    <Button label="Add Parent" variant="dark" shape="rounded" size="small" />
                </Link>
            </div>

            <ShowcaseSection title="All Parents" className="!p-6.5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Title</th>
                                <th className="px-4 py-2 text-left">Surname</th>
                                <th className="px-4 py-2 text-left">First Name(s)</th>
                                <th className="px-4 py-2 text-left">Relationship</th>
                                <th className="px-4 py-2 text-left">Mobile</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parents.map((parent, idx) => (
                                <tr key={parent.id} className="border-b">
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">{parent.title}</td>
                                    <td className="px-4 py-2">{parent.surname}</td>
                                    <td className="px-4 py-2">{parent.firstNames}</td>
                                    <td className="px-4 py-2">{parent.relationship}</td>
                                    <td className="px-4 py-2">{parent.mobile}</td>
                                    <td className="px-4 py-2">{parent.email}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/dashboard/users/parents/${parent.id}`
                                            }>
                                            <Button
                                                label="View"
                                                variant="primary"
                                                shape="rounded"
                                                size="small"
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ShowcaseSection>
        </>
    );
}
