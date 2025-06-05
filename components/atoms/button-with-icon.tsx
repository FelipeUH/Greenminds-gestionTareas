import { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { VariantProps } from "class-variance-authority";

export function ButtonWithIcon( {Icon, children, ...props} : React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &{Icon: LucideIcon, children: React.ReactNode}) {
  return (
    <Button {...props}>
      <Icon />
      {children}
    </Button>
  );
}
