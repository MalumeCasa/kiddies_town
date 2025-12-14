// app/(dashboard)/fees/payments/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { PaymentForm } from "../../../components/PaymentForm";

export default function CreatePaymentPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      console.log("Recording payment:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to payments list
      router.push("/fees/payments");
    } catch (error) {
      console.error("Error recording payment:", error);
    }
  };

  const handleCancel = () => {
    router.push("/fees/payments");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Record Payment</h1>
        <p className="text-muted-foreground">
          Record a new fee payment for a student
        </p>
      </div>

      <PaymentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}