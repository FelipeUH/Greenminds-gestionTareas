import { Profile } from "@/types/database";
import { UserRow } from "../atoms/user-row";

export function UserTable({ users } : {users: Profile[]}) {

    return (
        <div>
            {
                users.map((user, i) => 
                    <UserRow 
                        key={i}
                        username={user.full_name}
                        email={user.email}
                    />
                )
            }
        </div>
    )
}