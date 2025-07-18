import  { Title }  from "@/components/atoms/title";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AppAvatar } from "../atoms/app-avatar";
import { ButtonWithIcon } from "../atoms/button-with-icon";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function NavBar({ className, ...props }: React.ComponentProps<"div">) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }

  return (
      <div className={cn("flex items-center justify-between w-full h-[100] bg-[var(--primary)] text-[var(--primary-foreground)] p-10", className)} {...props}>
        <Link href={"/projects"}>
         <Title>GreenMinds</Title>
        </Link>
        <div className="flex gap-4 text-black">
          <AppAvatar username={user?.full_name || "USER"}/>
          <ButtonWithIcon Icon={LogOut} onClick={handleLogout}>
            Cerrar sesión
          </ButtonWithIcon>
        </div>
      </div>
  );
}