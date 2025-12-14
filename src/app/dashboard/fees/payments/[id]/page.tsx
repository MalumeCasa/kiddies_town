// app/(dashboard)/fees/payments/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Edit, Printer } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your database
const paymentData = {
  id: "PAY001",
  studentId: "STU001",
  studentName: "John Doe",
  studentClass: "Grade 1",
  amount: 500,
  paymentDate: "2024-01-15",
  paymentMethod: "Bank Transfer",
  receiptNo: "RCPT001",
  status: "Completed",
  collectedBy: "Admin User",
  notes: "Tuition fee payment for January 2024",
  feeBreakdown: [
    { category: "Tuition Fee", amount: 400 },
    { category: "Activity Fee", amount: 50 },
    { category: "Sports Fee", amount: 50 }
  ]
};

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const handlePrintReceipt = () => {
    window.print();
  };

  const getStatusVariant = (status: string) => {
    return status === "Completed" ? "success" : "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Payment Details</h1>
          <p className="text-muted-foreground">
            View payment information and receipt details
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintReceipt}>
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Receipt Card */}
          <Card className="print:shadow-none">
            <CardHeader className="print:border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Payment Receipt</CardTitle>
                  <CardDescription>Receipt #{paymentData.receiptNo}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(paymentData.status)}>
                  {paymentData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{paymentData.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{paymentData.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{paymentData.studentClass}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p className="font-medium">{paymentData.paymentDate}</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Fee Breakdown</h4>
                <div className="space-y-2">
                  {paymentData.feeBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                      <span>{item.category}</span>
                      <span className="font-medium">${item.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t font-bold text-lg">
                    <span>Total Amount</span>
                    <span>${paymentData.amount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{paymentData.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Collected By</p>
                  <p className="font-medium">{paymentData.collectedBy}</p>
                </div>
              </div>

              {/* Notes */}
              {paymentData.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{paymentData.notes}</p>
                </div>
              )}

              {/* Receipt Footer */}
              <div className="border-t pt-4 text-center text-sm text-muted-foreground">
                <p>Thank you for your payment!</p>
                <p>This is an computer-generated receipt and does not require a signature.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-2xl text-green-600">${paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={getStatusVariant(paymentData.status)}>
                  {paymentData.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{paymentData.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receipt No</span>
                <span className="font-medium">{paymentData.receiptNo}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" onClick={handlePrintReceipt}>
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Payment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{paymentData.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{paymentData.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{paymentData.studentClass}</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Link href={`/fees/students/${paymentData.studentId}`}>
                    View Student Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}