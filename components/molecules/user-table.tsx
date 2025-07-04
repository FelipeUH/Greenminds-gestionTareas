import { UserRowProps, UserRow } from "../atoms/user-row";

export function UserTable({ users } : {users: UserRowProps[]}) {

    return (
        <div>
            {
                users.map((user, i) => 
                    <UserRow 
                        key={i}
                        username={user.username}
                        email={user.email}
                    />
                )
            }
        </div>
    )
}