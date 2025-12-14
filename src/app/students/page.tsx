import React from "react";
import Link from "next/link";

import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

import { neon } from "@neondatabase/serverless"
import { StudentCard } from "../../app/students/components/student-card"
import { StudentTable } from "../../app/students/components/student-table"

type Student = {
    id: number
    student_id: string
    name: string
    surname: string
    email: string
    major: string | null
    year: string | null
    gpa: number | null
    enrollment_date: string
}

async function getStudents(): Promise<Student[]> {
    try {
        const sql = neon(process.env.DATABASE_URL!)
        const students = await sql`
      SELECT * FROM students 
      ORDER BY name, surname
    `
        return students as Student[]
    } catch (error) {
        console.error("Error fetching students:", error)
        return []
    }
}

export default async function Home() {
    const students = await getStudents()

    return (
        <>
            <Breadcrumb pageName="Student Directory" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    <ShowcaseSection title="Student Directory" className="space-y-5.5 !p-6.5">


                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Student Directory</h1>

                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Browse our comprehensive student database with {students.length} enrolled students
                        </p>

                        {students.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600 mb-4">No students found in the database.</p>
                                <p className="text-gray-500">Please run the SQL script to create and populate the students table.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <StudentTable students={students} />
                                </div>

                                {/* Mobile Card View */}
                                <div className="lg:hidden grid gap-6 sm:grid-cols-2">
                                    {students.map((student) => (
                                        <StudentCard key={student.id} student={student} />
                                    ))}
                                </div>
                            </>
                        )}
                    </ShowcaseSection>
                </div>
            </div>
        </>

    )
}
