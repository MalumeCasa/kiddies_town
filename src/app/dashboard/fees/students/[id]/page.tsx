// app/(dashboard)/fees/students/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, DollarSign, Download, Send, FileText } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your database
const studentData = {
  id: "1",
  studentId: "STU001",
  name: "John Doe",
  class: "Grade 1",
  email: "john.doe@school.edu",
  phone: "+1 (555) 123-4567",
  totalFee: 1200,
  paid: 800,
  pending: 400,
  status: "Partial",
  dueDate: "2024-02-01",
  feeStructure: "Grade 1 - Annual Fee",
  paymentHistory: [
    {
      id: "PAY001",
      amount: 400,
      date: "2024-01-15",
      method: "Bank Transfer",
      receiptNo: "RCPT001",
      status: "Completed"
    },
    {
      id: "PAY002", 
      amount: 400,
      date: "2024-01-01",
      method: "Cash",
      receiptNo: "RCPT002",
      status: "Completed"
    }
  ]
};

export default function StudentFeeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid": return "success";
      case "Partial": return "secondary";
      case "Pending": return "destructive";
      default: return "outline";
    }
  };

  const paymentRate = (studentData.paid / studentData.totalFee) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Student Fee Details</h1>
          <p className="text-muted-foreground">
            View and manage fee payments for {studentData.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Link href={`/fees/payments/create?studentId=${studentData.studentId}`}>
              <DollarSign className="w-4 h-4 mr-2" />
              Record Payment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Student Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{studentData.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{studentData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{studentData.class}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{studentData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{studentData.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Structure</p>
                  <p className="font-medium">{studentData.feeStructure}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{studentData.dueDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Details and Payment History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fee Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
              <CardDescription>
                Current payment status and breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Payment Status</span>
                    <Badge variant={getStatusVariant(studentData.status)}>
                      {studentData.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{paymentRate.toFixed(1)}%</span>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>

                <Progress value={paymentRate} className="h-3" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">${studentData.totalFee}</p>
                    <p className="text-sm text-muted-foreground">Total Fee</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-green-600">${studentData.paid}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-orange-600">${studentData.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All payment transactions for this student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Receipt #{payment.receiptNo}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.date} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${payment.amount}</p>
                      <Badge variant="success" className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {studentData.paymentHistory.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment history found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          {studentData.pending > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>
                  Actions required for pending fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">Outstanding Balance</p>
                      <p className="text-sm text-muted-foreground">
                        Due by {studentData.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">${studentData.pending}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button className="flex-1">
                      <Link href={`/fees/payments/create?studentId=${studentData.studentId}`}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Record Payment
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}