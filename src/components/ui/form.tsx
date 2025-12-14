// src/components/ui/form.tsx
"use client"

import React from "react"
import { 
  useFormContext, 
  Controller, 
  ControllerProps, 
  FieldValues 
} from "react-hook-form"
import { cn } from "@/lib/utils"

// Form Context
const FormContext = React.createContext({})

// Form Component
interface FormProps<TFieldValues extends FieldValues> {
  children: React.ReactNode
  className?: string
  onSubmit?: any
}

export function Form<TFieldValues extends FieldValues>({ 
  children, 
  className,
  onSubmit,
  ...props 
}: FormProps<TFieldValues>) {
  return (
    <form 
      className={cn("space-y-6", className)} 
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  )
}

// FormField Component
interface FormFieldProps<TFieldValues extends FieldValues> {
  name: ControllerProps<TFieldValues>["name"]
  control?: ControllerProps<TFieldValues>["control"]
  render: ControllerProps<TFieldValues>["render"]
  defaultValue?: any
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  control,
  render,
  defaultValue,
  ...props
}: FormFieldProps<TFieldValues>) {
  const methods = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control || (methods?.control as any)}
      render={render}
      defaultValue={defaultValue}
      {...props}
    />
  )
}

// FormItem Component
interface FormItemProps {
  children: React.ReactNode
  className?: string
}

export function FormItem({ children, className }: FormItemProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}

// FormLabel Component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export function FormLabel({ children, className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}

// FormControl Component
interface FormControlProps {
  children: React.ReactNode
  className?: string
}

export function FormControl({ children, className }: FormControlProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

// FormMessage Component
interface FormMessageProps {
  children?: React.ReactNode
  className?: string
}

export function FormMessage({ children, className }: FormMessageProps) {
  if (!children) return null

  return (
    <p className={cn("text-sm font-medium text-red-600 dark:text-red-500", className)}>
      {children}
    </p>
  )
}

// FormDescription Component
interface FormDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function FormDescription({ children, className }: FormDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}