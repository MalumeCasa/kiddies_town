"use client"

import { use, useEffect, useState } from 'react'
import { mockReportCards } from "@lib/mock-data"
import { ReportCardView } from "@components/report-cards/report-card-view"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Logo } from "@/components/logo";

export default function PrintReportCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [isClient, setIsClient] = useState(false)

  const reportCard = mockReportCards.find((card) => card.id === id)

  useEffect(() => {
    setIsClient(true)
    // Auto-trigger print dialog when page loads
    window.print()
  }, [])

  if (!reportCard) {
    notFound()
  }

  return (
    <div suppressHydrationWarning>
      {/* Print Styles */}
      <style>{`
        @media print {
          * {
            margin: 0;
            padding: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          /* Hide sidebar and all non-print elements */
          [data-sidebar="sidebar"],
          [data-slot="sidebar-wrapper"],
          [data-slot="sidebar-gap"],
          [data-slot="sidebar-container"],
          .no-print,
          nav,
          aside,
          header {
            display: none !important;
          }
          .print-container {
            page-break-after: always;
            padding: 0;
            margin: 0;
            background: white;
            width: 100%;
          }
          .school-header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px 0;
            border-bottom: 2px solid #000;
          }
          .school-logo {
            max-width: 180px;
            height: auto;
            margin: 0 auto 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          .text-balance {
            text-wrap: balance;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 0.5rem;
            font-size: 0.875rem;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
        }
      `}</style>

      {/* No Print Controls */}
      <div className="no-print sticky top-0 bg-white border-b p-4 flex justify-between items-center z-50">
        <h2 className="text-lg font-semibold">Print Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            🖨️ Print
          </Button>
          {/* Use the unwrapped id here */}
          <Link href={`/academics/report-cards/${id}`}>
            <Button variant="outline">← Back</Button>
          </Link>
        </div>
      </div>

      {/* Printable Content */}
      <div className="print-container bg-white">
        <div className="school-header">
          {/* School Logo */}
          <div className="school-logo mb-4">
            <Logo
              width={240}
              height={100}
            />
          </div>
          
          {/* School Name and Address */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">KIDDIES TOWN ECD AND ACADEMY</h1>
            <p className="text-lg font-semibold text-gray-600 mb-2">"Building Your Child's Future"</p>
            <p className="text-sm text-gray-500">7 Grimm Street, Ster Park, Polokwane, 0700</p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>015 023 0600</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>info@kiddiestown.co.za</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <span>kiddiestown.co.za</span>
            </div>
          </div>
        </div>

        <ReportCardView reportCard={reportCard} />
      </div>
    </div>
  )
}