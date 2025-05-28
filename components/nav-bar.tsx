import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div className="flex items-center justify-between w-full h-[100] bg-[var(--primary)] text-[var(--primary-foreground)] p-10">
        <div className="font-semibold text-4xl">GreenMinds</div>
        <div className="flex gap-4 text-black">
          <Input type={"text"} placeholder="Buscar..." className="bg-white text-" />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
}