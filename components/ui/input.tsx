import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--color-error)] focus:ring-[var(--color-error)] text-[var(--color-error)]",
          success && "border-[var(--color-success)] focus:ring-[var(--color-success)] text-[var(--color-success)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
