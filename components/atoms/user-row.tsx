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
		</div>
	);
}
