import { Trash } from "lucide-react";

export interface UserRowProps {
    username: string,
    email: string
}

export function UserRow( { username, email } : UserRowProps ) {
	return (
		<div className="flex items-center justify-between border-[#9E9393] border-t py-2">
			<div className="flex flex-col">
				<span className="text-black">{username}</span>
				<span className="text-slate-500">{email}</span>
			</div>
				<button
					className="w-8 h-8 flex items-center justify-center bg-white border rounded-sm border-slate-200 text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition"
					title="Eliminar usuario"
				>
                    <Trash />
                </button>
		</div>
	);
}
