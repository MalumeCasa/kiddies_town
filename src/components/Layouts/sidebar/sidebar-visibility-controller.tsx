// components/Layouts/sidebar/sidebar-visibility-controller.tsx
"use client";

import { ReactNode } from "react";
import { useSidebarVisibility } from "@/hooks/useSidebarVisibility";

interface SidebarVisibilityControllerProps {
  children: ReactNode;
}

export function SidebarVisibilityController({ children }: SidebarVisibilityControllerProps) {
  // This hook will automatically control sidebar visibility based on route
  useSidebarVisibility();
  
  return <>{children}</>;
}