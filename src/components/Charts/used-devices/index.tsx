"use client";

import { cn } from "@/lib/utils";

interface UsedDevicesProps {
  timeFrame?: string;
  className?: string;
}

export function UsedDevices({ timeFrame, className }: UsedDevicesProps) {
  // Mock data for devices used in school
  const devicesData = [
    { device: "Laptops", percentage: 45, color: "bg-blue-500" },
    { device: "Tablets", percentage: 30, color: "bg-green-500" },
    { device: "Desktops", percentage: 15, color: "bg-purple-500" },
    { device: "Smartphones", percentage: 10, color: "bg-orange-500" },
  ];

  return (
    <div className={cn("rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <h2 className="mb-6 text-body-2xlg font-bold text-dark dark:text-white">
        Devices Used
      </h2>

      <div className="space-y-4">
        {devicesData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-dark dark:text-white">{item.device}</span>
              <span className="text-dark-6">{item.percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-dark-3">
              <div
                className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {devicesData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`size-3 rounded-full ${item.color}`}></div>
            <span className="text-sm text-dark-6">{item.device}</span>
          </div>
        ))}
      </div>
    </div>
  );
}