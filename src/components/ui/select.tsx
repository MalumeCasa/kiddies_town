// src/components/FormElements/select/index.tsx
"use client";

import React from "react";
import { cn } from "@/components/ui/utils";

// Types
interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectItemType {
  label: string;
  value: string;
  disabled?: boolean;
}

// Context
const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

// Hook to use Select context
function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select provider");
  }
  return context;
}

// Select Component - Updated with new props
interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  // New props for simplified usage
  label?: string;
  placeholder?: string;
  items?: SelectItemType[];
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  // New props
  label,
  placeholder = "Select an option...",
  items = [],
  required = false,
  error,
  helperText,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue || value);

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  // Find the selected item for display
  const selectedItem = items.find(item => item.value === internalValue);

  // If using the simplified API with items prop
  const renderSimplifiedSelect = () => (
    <SelectContext.Provider
      value={{
        value: internalValue,
        onValueChange: handleValueChange,
        open,
        onOpenChange: setOpen,
      }}
    >
      <div className={cn("relative", className)}>
        <SelectTrigger disabled={disabled}>
          <SelectValue 
            placeholder={placeholder}
            selectedItem={selectedItem}
          />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem 
              key={item.value} 
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </div>
    </SelectContext.Provider>
  );

  // If using children (original API)
  const renderCustomSelect = () => (
    <SelectContext.Provider
      value={{
        value: internalValue,
        onValueChange: handleValueChange,
        open,
        onOpenChange: setOpen,
      }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </SelectContext.Provider>
  );

  const selectContent = children ? renderCustomSelect() : renderSimplifiedSelect();

  // Wrap with field container if label, error, or helperText is provided
  if (label || error || helperText) {
    return (
      <div className="space-y-2">
        {label && (
          <FieldLabel required={required}>
            {label}
          </FieldLabel>
        )}
        {selectContent}
        {error && <FieldError>{error}</FieldError>}
        {helperText && !error && <FieldHelperText>{helperText}</FieldHelperText>}
      </div>
    );
  }

  return selectContent;
};

// Select Trigger Component
interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className,
  disabled,
}) => {
  const context = useSelect();

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white transition-colors placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-blue-600",
        className
      )}
      onClick={() => !disabled && context.onOpenChange(!context.open)}
      disabled={disabled}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          context.open && "rotate-180"
        )}
      />
    </button>
  );
};

// Select Value Component - Updated to handle selected item
interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
  selectedItem?: SelectItemType;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = "Select an option...",
  children,
  selectedItem
}) => {
  const context = useSelect();

  // If children is provided, use it (for custom rendering)
  if (children) {
    return <>{children}</>;
  }

  // Show selected item label or placeholder
  return (
    <span className={cn("block truncate", !context.value && "text-gray-500")}>
      {selectedItem ? selectedItem.label : placeholder}
    </span>
  );
};

// Select Content Component
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  position?: "popper" | "item-aligned";
}

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
  position = "item-aligned",
}) => {
  const context = useSelect();

  if (!context.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        position === "popper" && "w-full",
        className
      )}
      style={{
        top: "100%",
        left: 0,
        right: 0,
        marginTop: "4px",
      }}
    >
      <div className="max-h-60 overflow-auto p-1">{children}</div>
    </div>
  );
};

// Select Item Component
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  className,
  disabled,
}) => {
  const context = useSelect();

  const handleClick = () => {
    if (!disabled) {
      context.onValueChange?.(value);
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
        context.value === value && "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-50",
        className
      )}
      onClick={handleClick}
      data-disabled={disabled ? "" : undefined}
    >
      {children}
    </div>
  );
};

// Select Group Component
interface SelectGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({ children, className }) => {
  return <div className={cn("p-1", className)}>{children}</div>;
};

// Select Label Component
interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectLabel: React.FC<SelectLabelProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "py-1.5 pl-2 pr-2 text-sm font-semibold text-gray-900 dark:text-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
};

// Select Separator Component
export const SelectSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-700", className)}
    />
  );
};

// Field Label Component
interface FieldLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({
  htmlFor,
  children,
  className,
  required = false,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300",
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// Field Error Component
interface FieldErrorProps {
  children: React.ReactNode;
  className?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ children, className }) => {
  return (
    <p className={cn("mt-1 text-sm text-red-600 dark:text-red-400", className)}>
      {children}
    </p>
  );
};

// Field Helper Text Component
interface FieldHelperTextProps {
  children: React.ReactNode;
  className?: string;
}

const FieldHelperText: React.FC<FieldHelperTextProps> = ({ children, className }) => {
  return (
    <p className={cn("mt-1 text-sm text-gray-500 dark:text-gray-400", className)}>
      {children}
    </p>
  );
};

// Simple ChevronDown Icon
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Export all components - Only export what's needed externally
export {
  Select as Root,
  SelectTrigger as Trigger,
  SelectContent as Content,
  SelectItem as Item,
  SelectValue as Value,
  SelectGroup as Group,
  SelectLabel as Label,
  SelectSeparator as Separator,
};

// Export type for items
export type { SelectItemType };