// app/assignments/page.tsx
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui-elements/button";
import AssignmentForm from "../components/assignment-form";
import { getAllClasses } from "@api/class-actions";
import { getAllSubjects } from "@api/subject-actions";
import { getAllTeachers } from "@api/teacher-actions";

export const metadata: Metadata = {
  title: "Create New Assignment",
  description: "Create a new assignment for students",
};

export default async function CreateAssignmentPage() {
  // Fetch data for the form
  const [classesData, subjectsData, teachersData] = await Promise.all([
    getAllClasses(),
    getAllSubjects(),
    getAllTeachers(),
  ]);

  const classes = classesData.success ? classesData.data : [];
  const teachers = teachersData.success ? teachersData.data : [];
  
  // Transform subjects data to match the expected type
  const subjects = subjectsData.success ? subjectsData.data.map(subject => ({
    ...subject,
    assessments: subject.assessments && Array.isArray(subject.assessments) 
      ? subject.assessments 
      : null
  })) : [];

  return (
    <>
      <Breadcrumb pageName="Create Assignment" />
      
      {/* BUTTONS */}
      <div className="flex justify-between mb-6 gap-3">
        <Link href="/academics/assignments">
          <Button
            label="Back to Assignments"
            variant="outline"
            shape="rounded"
            size="small"
            icon="←"
          />
        </Link>
        
        <div className="flex gap-3">
          <Link href="/academics/assignments">
            <Button
              label="View All Assignments"
              variant="outline"
              shape="rounded"
              size="small"
              icon="📋"
            />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <AssignmentForm 
            classes={classes}
            subjects={subjects}
            teachers={teachers}
          />
        </div>
      </div>
    </>
  );
}