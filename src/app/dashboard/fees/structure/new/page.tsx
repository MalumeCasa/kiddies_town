"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeeStructureForm } from "../../../components/FeeStructureForm";

interface FeeStructureData {
  name: string;
  description: string;
  academicYear: string;
  gradeLevel: string;
  feeType: string;
  amount: number;
  frequency: string;
  dueDate: string;
  isActive: boolean;
  applicableMonths: string[];
  lateFeePenalty: number;
  discountEarlyPayment: number;
  installmentPlan: boolean;
  maxInstallments: number;
}

export default function NewFeeStructurePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FeeStructureData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      console.log("Creating fee structure:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to fee structures list
      router.push("/fees/structure");
    } catch (error) {
      console.error("Error creating fee structure:", error);
    } finally {
      setIsSubmitting(false);
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
}