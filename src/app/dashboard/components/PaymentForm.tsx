// components/fees/PaymentForm.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User, DollarSign, Calendar } from "lucide-react";

interface PaymentFormProps {
  initialData?: {
    id?: string;
    studentId: string;
    studentName: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    receiptNo: string;
    notes?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    studentId: initialData?.studentId || "",
    studentName: initialData?.studentName || "",
    amount: initialData?.amount || 0,
    paymentDate: initialData?.paymentDate || new Date().toISOString().split('T')[0],
    paymentMethod: initialData?.paymentMethod || "Cash",
    receiptNo: initialData?.receiptNo || `RCPT${Date.now()}`,
    notes: initialData?.notes || ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Mock student search - replace with actual API call
  const students = [
    { id: "STU001", name: "John Doe", class: "Grade 1", pendingFees: 500 },
    { id: "STU002", name: "Jane Smith", class: "Grade 2", pendingFees: 750 },
    { id: "STU003", name: "Mike Johnson", class: "Grade 1", pendingFees: 1200 },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectStudent = (student: any) => {
    setFormData(prev => ({
      ...prev,
      studentId: student.id,
      studentName: student.name
    }));
    setSearchTerm("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Payment Record" : "Record New Payment"}
        </CardTitle>
        <CardDescription>
          {initialData?.id 
            ? "Update payment details" 
            : "Record a fee payment for a student"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Search and Selection */}
          <div className="space-y-4">
            <Label>Select Student</Label>
            
            {!formData.studentId ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name or ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => selectStudent(student)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.id} • {student.class}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">
                            Pending: ${student.pendingFees}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{formData.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.studentId}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, studentId: "", studentName: "" }))}
                >
                  Change
                </Button>
              </div>
            )}
          </div>

          {formData.studentId && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="paymentDate"
                      type="date"
                      className="pl-10"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online Payment</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptNo">Receipt Number</Label>
                  <Input
                    id="receiptNo"
                    placeholder="Receipt number"
                    value={formData.receiptNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, receiptNo: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Additional notes about this payment..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading}>
                  {initialData?.id ? "Update Payment" : "Record Payment"}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}