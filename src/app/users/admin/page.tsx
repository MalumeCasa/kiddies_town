import { AttendanceOverview } from "@/components/Charts/attendance-overview";
import { PerformanceTrend } from "@/components/Charts/performance-trend";
import { UsedDevices } from "@/components/Charts/used-devices";
import { TopClasses } from "@/components/Tables/top-classes";
import { TopClassesSkeleton } from "@/components/Tables/top-classes/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { RecentActivityCard } from "./_components/recent-activity-card";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";


type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Dashboard({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  const timeFrameData = {
    attendanceTimeFrame: extractTimeFrame("attendance_overview")?.split(":")[1],
    performanceTimeFrame: extractTimeFrame("performance_trend")?.split(":")[1],
    devicesTimeFrame: extractTimeFrame("used_devices")?.split(":")[1],
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">School Dashboard</h1>
        <p className="text-dark-6 mt-2">Welcome to your school management system</p>
      </div>

      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <Suspense fallback={<div className="col-span-12 xl:col-span-7 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">Loading attendance data...</div>}>
          <AttendanceOverview 
            timeFrame={timeFrameData.attendanceTimeFrame}
            className="col-span-12 xl:col-span-7" 
          />
        </Suspense>

        <Suspense fallback={<div className="col-span-12 xl:col-span-5 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">Loading performance data...</div>}>
          <PerformanceTrend 
            timeFrame={timeFrameData.performanceTimeFrame}
            className="col-span-12 xl:col-span-5" 
          />
        </Suspense>

        <Suspense fallback={<div className="col-span-12 xl:col-span-5 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">Loading devices data...</div>}>
          <UsedDevices 
            timeFrame={timeFrameData.devicesTimeFrame}
            className="col-span-12 xl:col-span-5" 
          />
        </Suspense>

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopClassesSkeleton />}>
            <TopClasses />
          </Suspense>
        </div>

        <Suspense fallback={<div className="col-span-12 xl:col-span-4 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">Loading recent activity...</div>}>
          <RecentActivityCard />
        </Suspense>
      </div>
    </>
  );
}