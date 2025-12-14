import { cn } from "@/lib/utils"

interface GradeBadgeProps {
  grade: string
  percentage: number
}

export function GradeBadge({ grade, percentage }: GradeBadgeProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-emerald-100 text-emerald-700"
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-700"
      case "C":
        return "bg-yellow-100 text-yellow-700"
      case "D":
        return "bg-orange-100 text-orange-700"
      case "F":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={cn("px-3 py-1 rounded-full font-semibold text-sm", getGradeColor(grade))}>{grade}</span>
      <span className="text-xs text-muted-foreground">{percentage}%</span>
    </div>
  )
}
