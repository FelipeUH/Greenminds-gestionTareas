import { PriorityTag } from "../atoms/priority-tag";
import { Title } from "../atoms/title";
import { AppAvatar } from "../atoms/app-avatar";

export type TaskCardProps = {
  taskTitle: string;
  assignedUsers: string[];
  priorityLevel: "high" | "medium" | "low"; 
};

const priorityTagText = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export function TaskCard({
  taskTitle,
  assignedUsers,
  priorityLevel,
}: TaskCardProps) {
  return (
    <div className="w-full h-[80px] bg-primary rounded-sm shadow-md flex justify-between items-center p-6">
      <div className="flex flex-col">
        <Title className="text-sm">{taskTitle}</Title>
        <div className="flex gap-2">
          {assignedUsers.map((user, index) => (
            <AppAvatar username={user} key={index} />
          ))}
        </div>
      </div>
      <PriorityTag variant={priorityLevel}>
        {priorityTagText[priorityLevel]}
      </PriorityTag>
    </div>
  );
}
