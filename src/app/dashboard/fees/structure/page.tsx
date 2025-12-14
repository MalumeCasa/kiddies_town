// app/(dashboard)/fees/structure/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Download,
  Upload
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from your database
const feeStructures = [
  {
    id: "1",
    name: "Grade 1 - Annual Fee",
    class: "Grade 1",
    amount: 1200,
    frequency: "Annual",
    categories: ["Tuition", "Activities", "Sports"],
    status: "Active",
    created: "2024-01-01"
  },
  {
    id: "2",
    name: "Grade 2 - Term Fee",
    class: "Grade 2",
    amount: 1500,
    frequency: "Term",
    categories: ["Tuition", "Library", "Lab"],
    status: "Active",
    created: "2024-01-01"
  },
  {
    id: "3",
    name: "Transport Fee",
    class: "All",
    amount: 300,
    frequency: "Monthly",
    categories: ["Transport"],
    status: "Active",
    created: "2024-01-01"
  }
];

export default function FeeStructurePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredStructures = feeStructures.filter(structure => 
    structure.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === "all" || structure.class === selectedClass)
  );

  const classes = ["All", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Structure</h1>
          <p className="text-muted-foreground">
            Manage fee structures and categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Link href="/dashboard/fees/structure/new">
              <Plus className="w-4 h-4 mr-2" />
              New Structure
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fee structures..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls === "All" ? "all" : cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="md">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structures Grid */}
      <div className="grid gap-4">
        {filteredStructures.map((structure) => (
          <Card key={structure.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{structure.name}</h3>
                    <Badge variant={structure.status === "Active" ? "default" : "secondary"}>
                      {structure.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Class: {structure.class}</span>
                    <span>Amount: ${structure.amount}</span>
                    <span>Frequency: {structure.frequency}</span>
                  </div>
                  <div className="flex gap-1">
                    {structure.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Link href={`/dashboard/fees/structure/${structure.id}`}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStructures.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No fee structures found.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}