import { cn } from "@/lib/utils"

type TitleProps = {
  children: React.ReactNode,
  className?: string
}

export function Title( { children, className }: TitleProps ) {
  return (
    <div className={cn("font-semibold text-4xl", className)}>
        {children}
    </div>
  )
}