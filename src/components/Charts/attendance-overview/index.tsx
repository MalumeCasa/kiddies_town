"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AttendanceData {
  day?: string;
  week?: string;
  month?: string;
  attendance: number;
  late: number;
  absent: number;
}

interface AttendanceOverviewProps {
  timeFrame?: string;
  className?: string;
}

// Mock data for different timeframes
const attendanceData = {
  daily: [
    { day: "Mon", attendance: 92, late: 5, absent: 3 },
    { day: "Tue", attendance: 94, late: 4, absent: 2 },
    { day: "Wed", attendance: 91, late: 6, absent: 3 },
    { day: "Thu", attendance: 95, late: 3, absent: 2 },
    { day: "Fri", attendance: 93, late: 4, absent: 3 },
    { day: "Sat", attendance: 90, late: 5, absent: 5 },
    { day: "Sun", attendance: 88, late: 6, absent: 6 },
  ],
  weekly: [
    { week: "Week 1", attendance: 91, late: 5, absent: 4 },
    { week: "Week 2", attendance: 93, late: 4, absent: 3 },
    { week: "Week 3", attendance: 94, late: 3, absent: 3 },
    { week: "Week 4", attendance: 92, late: 5, absent: 3 },
  ],
  monthly: [
    { month: "Jan", attendance: 91, late: 6, absent: 3 },
    { month: "Feb", attendance: 92, late: 5, absent: 3 },
    { month: "Mar", attendance: 93, late: 4, absent: 3 },
    { month: "Apr", attendance: 94, late: 3, absent: 3 },
    { month: "May", attendance: 95, late: 3, absent: 2 },
    { month: "Jun", attendance: 94, late: 4, absent: 2 },
  ]
};

export function AttendanceOverview({ timeFrame, className }: AttendanceOverviewProps) {
  const [data, setData] = useState<AttendanceData[]>([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const selectedData = attendanceData[timeFrame as keyof typeof attendanceData] || attendanceData.daily;
      setData(selectedData);
    };

    fetchData();
  }, [timeFrame]);

  const getXAxisLabel = (item: AttendanceData) => {
    return item.day || item.week || item.month || '';
  };

  const averageAttendance = data.length > 0 
    ? Math.round(data.reduce((acc, item) => acc + item.attendance, 0) / data.length)
    : 0;

  if (data.length === 0) {
    return (
      <div className={cn("rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Attendance Overview
        </h2>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-sm">
            <div className="size-3 rounded-full bg-green-500"></div>
            Present
          </span>
          <span className="flex items-center gap-2 text-sm">
            <div className="size-3 rounded-full bg-yellow-500"></div>
            Late
          </span>
          <span className="flex items-center gap-2 text-sm">
            <div className="size-3 rounded-full bg-red-500"></div>
            Absent
          </span>
        </div>
      </div>

      <div className="h-80">
        <div className="flex h-full items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-col items-center gap-1">
                {/* Present bar */}
                <div
                  className="w-3/4 rounded-t bg-green-500 transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${item.attendance * 0.6}px` }}
                  title={`Present: ${item.attendance}%`}
                />
                {/* Late bar */}
                <div
                  className="w-1/2 bg-yellow-500 transition-all duration-300 hover:bg-yellow-600"
                  style={{ height: `${item.late * 0.8}px` }}
                  title={`Late: ${item.late}%`}
                />
                {/* Absent bar */}
                <div
                  className="w-1/3 rounded-b bg-red-500 transition-all duration-300 hover:bg-red-600"
                  style={{ height: `${item.absent * 1.2}px` }}
                  title={`Absent: ${item.absent}%`}
                />
              </div>
              <span className="text-xs font-medium text-dark-6 dark:text-dark-5">
                {getXAxisLabel(item)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-dark dark:text-white">
            Average Attendance: {averageAttendance}%
          </p>
          <p className="text-sm text-dark-6">
            Based on {timeFrame || 'daily'} data
          </p>
        </div>
      </div>
    </div>
  );
}