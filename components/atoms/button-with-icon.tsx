import { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Componente de botón que integra un icono dentro de su contenido
// muy util debido a que se usa a lo largo de toda la aplicación y hace más
// intuitiva la navegación a través de esta
export function ButtonWithIcon( {Icon, children, className, ...props} : React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &{Icon: LucideIcon, children: React.ReactNode}) {
  return (
    <Button {...props} className={cn("cursor-pointer", className)}>
      <Icon />
      {children}
    </Button>
  );
}
