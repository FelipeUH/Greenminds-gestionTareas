import { Avatar, AvatarFallback } from "../ui/avatar";

export function AppAvatar( { username } : { username: string} ) {
	return (
		<Avatar>
			<AvatarFallback className="bg-slate-200 w-[30px] h-[30px]">
				{username.slice(0, 2).toUpperCase()} {/* Primeras dos iniciales del nombre de usuario */}
			</AvatarFallback>
		</Avatar>
	);
}
