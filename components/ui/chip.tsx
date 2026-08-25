import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-primary",
  {
    variants: {
      variant: {
        category: "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]",
        statusActive: "bg-green-50 border border-green-200 text-green-700",
        statusInProgress: "bg-orange-50 border border-orange-200 text-orange-700",
        statusCompleted: "bg-green-50 border border-green-200 text-green-700",
        statusCancelled: "bg-red-50 border border-red-200 text-red-700",
        filterActive: "bg-[var(--color-secondary)] text-white",
        filterInactive: "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-background)]",
        badge: "bg-blue-50 text-blue-700 rounded-md px-2",
        tag: "bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-md",
      },
    },
    defaultVariants: {
      variant: "category",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(chipVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }
