// src/components/ui/button.tsx
import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...rest
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variant styles
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow",
    link: "bg-transparent text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500 shadow-none"
  };

  // Size styles
  const sizeStyles = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    xl: "px-6 py-3.5 text-base",
    icon: "p-2" // Square padding for icon buttons
  };

  const buttonClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    size === "icon" && "aspect-square", // Ensure icon buttons are square
    loading && "relative text-transparent hover:text-transparent cursor-wait",
    className
  );

  return (
    <button 
      className={buttonClassName} 
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {children}
    </button>
  );
};

// Icon Button variant for buttons with only icons (now using size="icon")
type IconButtonProps = Omit<ButtonProps, 'children' | 'size'> & {
  icon: React.ReactNode;
  'aria-label': string;
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // Remove "icon" since it's the default behavior
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "md",
  variant = "ghost",
  className,
  ...rest
}) => {
  const sizeStyles = {
    xs: "p-1.5",
    sm: "p-2", 
    md: "p-2.5",
    lg: "p-3",
    xl: "p-3.5"
  };

  return (
    <Button
      size="icon" // Always use icon size for IconButton
      variant={variant}
      className={cn(
        sizeStyles[size], // Apply specific padding based on the size prop
        className
      )}
      {...rest}
    >
      {icon}
    </Button>
  );
};

// Button Group component for related buttons
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = "horizontal"
}) => {
  return (
    <div 
      className={cn(
        "inline-flex",
        orientation === "horizontal" 
          ? "flex-row space-x-0 divide-x divide-gray-200 dark:divide-gray-700 rounded-md shadow-sm" 
          : "flex-col space-y-0 divide-y divide-gray-200 dark:divide-gray-700 rounded-md shadow-sm",
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-ignore
            className: cn(
              child.props.className,
              "rounded-none shadow-none",
              orientation === "horizontal" 
                ? index === 0 
                  ? "rounded-l-md" 
                  : index === React.Children.count(children) - 1 
                    ? "rounded-r-md" 
                    : ""
                : index === 0 
                  ? "rounded-t-md" 
                  : index === React.Children.count(children) - 1 
                    ? "rounded-b-md" 
                    : ""
            )
          });
        }
        return child;
      })}
    </div>
  );
};