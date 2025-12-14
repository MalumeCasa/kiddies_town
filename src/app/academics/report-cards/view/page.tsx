"use client"

import { useState, useMemo } from "react"
import { mockReportCards } from "@lib/mock-data"
import { ReportCardTable } from "@components/report-cards/report-card-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function ReportCardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")

  const filteredCards = useMemo(() => {
    return mockReportCards.filter((card) => {
      const matchesSearch =
        card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || card.rollNumber.includes(searchTerm)
      const matchesClass = classFilter === "all" || card.className === classFilter
      return matchesSearch && matchesClass
    })
  }, [searchTerm, classFilter])

  const uniqueClasses = Array.from(new Set(mockReportCards.map((card) => card.className)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/academics/report-cards">
            <Button variant="outline" className="mb-4 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-gray-600 mt-2">View and manage student report cards</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search by Name or Roll No.</label>
              <Input
                placeholder="Enter student name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Class</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredCards.length}</span> report card(s)
          </p>
        </div>

        {/* Table */}
        {filteredCards.length > 0 ? (
          <ReportCardTable reportCards={filteredCards} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-600">No report cards found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
