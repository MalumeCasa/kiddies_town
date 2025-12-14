"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PerformanceData {
  subject: string;
  average: number;
  improvement: number;
}

interface PerformanceTrendProps {
  timeFrame?: string;
  className?: string;
}

// Mock data for different timeframes
const performanceData = {
  daily: [
    { subject: "Math", average: 85, improvement: 2 },
    { subject: "Science", average: 78, improvement: 1 },
    { subject: "English", average: 82, improvement: 3 },
    { subject: "History", average: 75, improvement: 0 },
    { subject: "Physics", average: 80, improvement: 2 },
  ],
  weekly: [
    { subject: "Math", average: 87, improvement: 3 },
    { subject: "Science", average: 79, improvement: 2 },
    { subject: "English", average: 83, improvement: 4 },
    { subject: "History", average: 76, improvement: 1 },
    { subject: "Physics", average: 81, improvement: 3 },
  ],
  monthly: [
    { subject: "Math", average: 88, improvement: 5 },
    { subject: "Science", average: 80, improvement: 3 },
    { subject: "English", average: 84, improvement: 5 },
    { subject: "History", average: 77, improvement: 2 },
    { subject: "Physics", average: 82, improvement: 4 },
  ]
};

export function PerformanceTrend({ timeFrame, className }: PerformanceTrendProps) {
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const selectedData = performanceData[timeFrame as keyof typeof performanceData] || performanceData.daily;
      setData(selectedData);
    };

    fetchData();
  }, [timeFrame]);

  const overallAverage = data.length > 0 
    ? Math.round(data.reduce((acc, item) => acc + item.average, 0) / data.length)
    : 0;

  if (data.length === 0) {
    return (
      <div className={cn("rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <h2 className="mb-6 text-body-2xlg font-bold text-dark dark:text-white">
        Performance Trend
      </h2>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <span className="text-sm font-semibold">
                  {item.subject.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  {item.subject}
                </p>
                <p className="text-sm text-dark-6">
                  Average: {item.average}%
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-1 text-sm font-medium ${
              item.improvement >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.improvement >= 0 ? '↑' : '↓'}
              {Math.abs(item.improvement)}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm text-dark-6">
          <span>Subject</span>
          <span>Improvement</span>
        </div>
        
        {/* Progress bars for visual representation */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{item.subject}</span>
                <span>{item.average}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-dark-3">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${item.average}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-dark-6">
          Overall Average: {overallAverage}%
        </p>
      </div>
    </div>
  );
}