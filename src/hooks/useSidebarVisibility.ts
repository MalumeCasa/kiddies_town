// hooks/useSidebarVisibility.ts
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebarContext } from "@components/Layouts/sidebar/sidebar-context";

export function useSidebarVisibility() {
  const pathname = usePathname();
  const { setSidebarEnabled } = useSidebarContext();

  useEffect(() => {
    // Define routes where sidebar should be hidden
    const hiddenRoutes = [
      "/",
      "/home",
      "/login",
      "/signup",
      "/register",
      "/auth",
      "/onboarding",
      // Add more routes as needed
    ];

    // Check if current path matches any hidden route
    const shouldHideSidebar = hiddenRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    setSidebarEnabled(!shouldHideSidebar);

    // Cleanup function to reset sidebar state
    return () => {
      setSidebarEnabled(true);
    };
  }, [pathname, setSidebarEnabled]);
}