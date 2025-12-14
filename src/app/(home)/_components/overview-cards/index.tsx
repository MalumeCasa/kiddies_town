"use client";

import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { useEffect, useState } from "react";

interface OverviewData {
  students: { value: number; growthRate: number };
  teachers: { value: number; growthRate: number };
  classes: { value: number; growthRate: number };
  attendance: { value: number; growthRate: number };
}

export function OverviewCardsGroup() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockData: OverviewData = {
        students: { value: 1245, growthRate: 2.43 },
        teachers: { value: 68, growthRate: 1.35 },
        classes: { value: 42, growthRate: 0.59 },
        attendance: { value: 94.2, growthRate: 0.95 },
      };
      
      setData(mockData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <div className="animate-pulse">
              <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="mb-1.5 h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Students"
        data={{
          value: compactFormat(data.students.value),
          growthRate: data.students.growthRate,
        }}
        Icon={icons.Students}
      />

      <OverviewCard
        label="Teaching Staff"
        data={{
          value: compactFormat(data.teachers.value),
          growthRate: data.teachers.growthRate,
        }}
        Icon={icons.Teachers}
      />

      <OverviewCard
        label="Active Classes"
        data={{
          value: compactFormat(data.classes.value),
          growthRate: data.classes.growthRate,
        }}
        Icon={icons.Classes}
      />

      <OverviewCard
        label="Attendance Rate"
        data={{
          value: data.attendance.value + "%",
          growthRate: data.attendance.growthRate,
        }}
        Icon={icons.Attendance}
      />
    </div>
  );
}