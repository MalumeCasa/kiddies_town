// src/components/ui/badge.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  // FIX 1: Add "warning" to the allowed variants
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; 
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
      secondary: "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      destructive: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
      outline: "border border-gray-300 text-gray-700 bg-transparent dark:border-gray-600 dark:text-gray-300",
      success: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
      // FIX 2: Define the Tailwind CSS classes for the new "warning" variant
      warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800",
    };

    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variantStyles[variant as keyof typeof variantStyles], // Safely access variantStyles
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };