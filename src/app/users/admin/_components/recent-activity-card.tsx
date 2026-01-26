"use client";

import { DotIcon } from "@/assets/icons";
import { formatMessageTime } from "@/lib/format-message-time";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Activity {
  name: string;
  profile: string;
  isActive: boolean;
  lastActivity: {
    content: string;
    type: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

export function RecentActivityCard() {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: Activity[] = [
        {
          name: "Sarah Johnson",
          profile: "/images/user/student-01.png",
          isActive: true,
          lastActivity: {
            content: "Submitted Math assignment",
            type: "assignment",
            timestamp: "2024-12-19T14:30:00Z",
            isRead: false,
          },
          unreadCount: 2,
        },
        {
          name: "Mr. David Wilson",
          profile: "/images/user/teacher-01.png",
          isActive: true,
          lastActivity: {
            content: "Graded Science tests",
            type: "grade",
            timestamp: "2024-12-19T10:15:00Z",
            isRead: true,
          },
          unreadCount: 0,
        },
        {
          name: "Michael Brown",
          profile: "/images/user/student-02.png",
          isActive: false,
          lastActivity: {
            content: "Asked question in Physics",
            type: "question",
            timestamp: "2024-12-19T10:15:00Z",
            isRead: true,
          },
          unreadCount: 0,
        },
        {
          name: "Mrs. Lisa Garcia",
          profile: "/images/user/teacher-02.png",
          isActive: false,
          lastActivity: {
            content: "Posted new assignment",
            type: "assignment",
            timestamp: "2024-12-19T10:15:00Z",
            isRead: true,
          },
          unreadCount: 1,
        },
        {
          name: "Emily Chen",
          profile: "/images/user/student-03.png",
          isActive: false,
          lastActivity: {
            content: "Completed English homework",
            type: "homework",
            timestamp: "2024-12-19T10:15:00Z",
            isRead: true,
          },
          unreadCount: 0,
        },
      ];

      setData(mockData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return "📝";
      case "grade":
        return "📊";
      case "question":
        return "❓";
      case "homework":
        return "📚";
      default:
        return "📌";
    }
  };

  if (loading) {
    return (
      <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-32 mb-5.5 mx-7.5"></div>
          <ul>
            {[...Array(5)].map((_, key) => (
              <li key={key} className="px-7.5 py-3">
                <div className="flex items-center gap-4.5">
                  <div className="size-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <h2 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
        Recent Activity
      </h2>

      <ul>
        {data.map((activity, key) => (
          <li key={key}>
            <Link
              href="/"
              className="flex items-center gap-4.5 px-7.5 py-3 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-2 dark:focus-visible:bg-dark-2"
            >
              <div className="relative shrink-0">
                <div className="flex size-14 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-3">
                  <span className="text-xl">
                    {getActivityIcon(activity.lastActivity.type)}
                  </span>
                </div>

                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-3.5 rounded-full ring-2 ring-white dark:ring-dark-2",
                    activity.isActive ? "bg-green" : "bg-orange-light",
                  )}
                />
              </div>

              <div className="relative flex-grow">
                <h3 className="font-medium text-dark dark:text-white">
                  {activity.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-sm font-medium dark:text-dark-5 xl:max-w-[8rem]",
                      activity.unreadCount && "text-dark-4 dark:text-dark-6",
                    )}
                  >
                    {activity.lastActivity.content}
                  </span>

                  <DotIcon />

                  <time
                    className="text-xs"
                    dateTime={activity.lastActivity.timestamp}
                  >
                    {formatMessageTime(activity.lastActivity.timestamp)}
                  </time>
                </div>

                {!!activity.unreadCount && (
                  <div className="pointer-events-none absolute right-0 top-1/2 aspect-square max-w-fit -translate-y-1/2 select-none rounded-full bg-primary px-2 py-0.5 text-sm font-medium text-white">
                    {activity.unreadCount}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}