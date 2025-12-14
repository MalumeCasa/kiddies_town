// src/components/ui/checkbox.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  size?: "sm" | "md" | "lg"
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "md", onCheckedChange, onChange, ...props }, ref) => {
    const sizeStyles = {
      sm: "h-4 w-4",
      md: "h-5 w-5", 
      lg: "h-6 w-6"
    }

    const iconSizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer appearance-none shrink-0 border border-gray-300 rounded-md bg-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "checked:bg-blue-600 checked:border-blue-600",
            "hover:border-gray-400",
            "dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-blue-600 dark:checked:border-blue-600",
            "dark:hover:border-gray-500",
            sizeStyles[size],
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <svg
          className={cn(
            "absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white",
            "transition-opacity duration-200 ease-in-out",
            "left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
            iconSizes[size]
          )}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
            fill="currentColor"
          />
        </svg>
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

// Checkbox with label component
interface CheckboxWithLabelProps extends CheckboxProps {
  label: string
  description?: string
}

export const CheckboxWithLabel = React.forwardRef<HTMLInputElement, CheckboxWithLabelProps>(
  ({ label, description, className, ...props }, ref) => {
    return (
      <div className={cn("flex items-start space-x-3", className)}>
        <Checkbox ref={ref} {...props} />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }
)

CheckboxWithLabel.displayName = "CheckboxWithLabel"