// app/curriculum/create/page.tsx
'use client'

import { CreateCurriculumForm } from "../component/curriculum-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateCurriculumPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/academics/curriculum">
          <Button variant="outline" className="mb-4">
            ← Back to Curriculum
          </Button>
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Curriculum</h1>
            <p className="text-gray-600">Design a comprehensive curriculum for your class and subject</p>
          </div>
        </div>
      </div>

      <CreateCurriculumForm />
    </div>
  );
}