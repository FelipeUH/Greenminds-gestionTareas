import { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function ButtonWithIcon( {Icon, children, className, ...props} : React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &{Icon: LucideIcon, children: React.ReactNode}) {
  return (
    <Button {...props} className={cn("cursor-pointer", className)}>
      <Icon />
      {children}
    </Button>
  );
}
