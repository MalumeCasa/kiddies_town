// app/(dashboard)/fees/payments/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  Eye,
  Download,
  Plus
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your database
const payments = [
  {
    id: "PAY001",
    studentName: "John Doe",
    studentId: "STU001",
    amount: 500,
    paymentDate: "2024-01-15",
    paymentMethod: "Cash",
    receiptNo: "RCPT001",
    status: "Completed",
    collectedBy: "Admin User"
  },
  {
    id: "PAY002",
    studentName: "Jane Smith",
    studentId: "STU002",
    amount: 750,
    paymentDate: "2024-01-14",
    paymentMethod: "Bank Transfer",
    receiptNo: "RCPT002",
    status: "Completed",
    collectedBy: "Admin User"
  },
  {
    id: "PAY003",
    studentName: "Mike Johnson",
    studentId: "STU003",
    amount: 600,
    paymentDate: "2024-01-14",
    paymentMethod: "Online",
    receiptNo: "RCPT003",
    status: "Completed",
    collectedBy: "Finance User"
  }
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter(payment => 
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    return status === "Completed" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            View and manage all fee payment records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Link href="/dashboard/fees/payments?action=create">
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.paymentMethod === "Cash").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.paymentMethod !== "Cash").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments by student name, receipt no, or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            All fee payment transactions recorded in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{payment.studentName}</h3>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>ID: {payment.studentId}</span>
                    <span>Receipt: {payment.receiptNo}</span>
                    <span>Method: {payment.paymentMethod}</span>
                    <span>Date: {payment.paymentDate}</span>
                  </div>
                  <div className="text-sm">
                    Collected by: {payment.collectedBy}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${payment.amount}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Link href={`/dashboard/fees/payments/${payment.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}