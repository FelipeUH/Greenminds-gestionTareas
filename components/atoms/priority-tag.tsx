import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type PriorityVariant = "high" | "medium" | "low"

// Definicion de diferentes variantes que cambian el color segun sea la prioridad de la tarea
const priorityVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        high:
          "border-transparent bg-red-200 text-slate-900 [a&]:hover:bg-red-200/90",
        medium:
          "border-transparent bg-yellow-200 text-slate-900 [a&]:hover:bg-yellow-200/90",
        low:
          "border-transparent bg-emerald-200 text-slate-900 [a&]:hover:bg-emerald-200/90"
      },
    },
    defaultVariants: {
      variant: "high",
    },
  }
)

interface PriorityTagProps extends React.ComponentProps<"span">, VariantProps<typeof priorityVariants> {
  variant: PriorityVariant
  asChild?: boolean
}

// Componente usado para mostrar la prioridad en un componente TaskCard
// adaptando su color según sea el nivel de prioridad mostrado
function PriorityTag({
  className,
  variant,
  asChild = false,
  ...props
}: PriorityTagProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      className={cn(priorityVariants({ variant }), className)}
      {...props}
    />
  )
}

export { PriorityTag, priorityVariants }