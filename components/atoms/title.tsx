import { cn } from "@/lib/utils"

type TitleProps = {
  children: React.ReactNode,
  className?: string
}

// Componente para manejar los títulos de diferentes partes de la aplicación
export function Title( { children, className }: TitleProps ) {
  return (
    <div className={cn("font-semibold text-4xl", className)}>
        {children}
    </div>
  )
}