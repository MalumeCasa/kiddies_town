import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CampaignVisitors } from "@/components/Charts/campaign-visitors";
import { UsedDevices } from "@/components/Charts/used-devices";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Basic Chart",
};

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

// Loading component
function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default p-4 ${className}`}>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default async function Page(props: PropsType) {
  const { selected_time_frame } = await props.searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const devicesTimeFrame = extractTimeFrame("used_devices")?.split(":")[1];

  // Fetch both chart data in parallel
  const [usedDevicesContent, campaignVisitorsContent] = await Promise.all([
    UsedDevices({ timeFrame: devicesTimeFrame, className: "col-span-12 xl:col-span-5" }),
    CampaignVisitors({ className: "col-span-12 xl:col-span-5" })
  ]);

  return (
    <>
      <Breadcrumb pageName="Basic Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Used Devices Chart */}
        <Suspense fallback={<ChartSkeleton className="col-span-12 xl:col-span-5" />}>
          {usedDevicesContent}
        </Suspense>

        {/* Campaign Visitors Chart */}
        <Suspense fallback={<ChartSkeleton className="col-span-12 xl:col-span-5" />}>
          {campaignVisitorsContent}
        </Suspense>
      </div>
    </>
  );
}