import { Input } from "../ui/input";
import  { Title }  from "@/components/atoms/title";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AppAvatar } from "../atoms/app-avatar";

export function NavBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
      <div className={cn("flex items-center justify-between w-full h-[100] bg-[var(--primary)] text-[var(--primary-foreground)] p-10", className)} {...props}>
        <Link href={"/projects"}>
         <Title>GreenMinds</Title>
        </Link>
        <div className="flex gap-4 text-black">
          <Input type={"text"} placeholder="Buscar..." className="bg-white" />
          <AppAvatar username="ADMIN"/>
        </div>
      </div>
  );
}