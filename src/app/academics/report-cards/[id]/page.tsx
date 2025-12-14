"use client"

import { use } from 'react'
import { mockReportCards } from "@lib/mock-data"
import { ReportCardView } from "@components/report-cards/report-card-view"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export default function ReportCardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Use the use() hook to unwrap the params promise
  const { id } = use(params)
  
  const reportCard = mockReportCards.find((card) => card.id === id)

  if (!reportCard) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link href="/academics/report-cards">
              <Button variant="outline" className="mb-4 bg-transparent">
                ← Back to Report Cards
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Report Card Details</h1>
          </div>
          <Link href={`/academics/report-cards/${id}/print`}>
            <Button className="w-full sm:w-auto">🖨️ Print Report Card</Button>
          </Link>
        </div>

        {/* Report Card */}
        <div className="bg-white rounded-lg shadow-md border p-8">
          <ReportCardView reportCard={reportCard} />
        </div>
      </div>
    </div>
  )
}