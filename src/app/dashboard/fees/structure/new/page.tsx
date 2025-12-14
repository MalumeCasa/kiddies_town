// app/(dashboard)/fees/structure/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import  { FeeStructureForm } from "../../../components/FeeStructureForm";

export default function NewFeeStructurePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      console.log("Creating fee structure:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to fee structures list
      router.push("/fees/structure");
    } catch (error) {
      console.error("Error creating fee structure:", error);
    }
  };

  const handleCancel = () => {
    router.push("/fees/structure");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Fee Structure</h1>
        <p className="text-muted-foreground">
          Define a new fee structure for classes
        </p>
      </div>

      <FeeStructureForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}