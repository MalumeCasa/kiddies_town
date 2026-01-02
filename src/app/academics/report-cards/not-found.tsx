import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Report Card Not Found</h1>
        <p className="text-gray-600">The report card you&#39;re looking for doesn&#39;t exist.</p>
        <Link href="/report-cards">
          <Button>← Back to Report Cards</Button>
        </Link>
      </div>
    </div>
  )
}
