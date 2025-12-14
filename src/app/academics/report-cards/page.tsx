"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">School Report Card System</h1>
            <p className="text-lg text-gray-600">Manage and view student report cards efficiently</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/academics/report-cards/view">
              <Button size="lg" className="w-full sm:w-auto">
                View Report Cards
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">View Report Cards</h3>
              <p className="text-sm text-gray-600">Access and search student report cards</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-semibold mb-2">Detailed View</h3>
              <p className="text-sm text-gray-600">See complete performance details</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="text-3xl mb-2">🖨️</div>
              <h3 className="font-semibold mb-2">Print Ready</h3>
              <p className="text-sm text-gray-600">Print report cards for official records</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
