import { PriorityTag } from "../atoms/priority-tag";
import { Title } from "../atoms/title";
import { AppAvatar } from "../atoms/app-avatar";
import { Task, TaskAssignment } from "@/types/database";

const priorityTagText = {
	high: "Alta",
	medium: "Media",
	low: "Baja",
};

export function TaskCard({
	task,
	onClick,
}: {
	task: Task;
	onClick: () => void;
}) {
	return (
		<div
			onClick={onClick}
			className="w-full h-[80px] bg-primary rounded-sm shadow-md flex justify-between items-center p-6 cursor-pointer"
		>
			<div className="flex flex-col">
				<Title className="text-sm">{task.title}</Title>
				<div className="flex gap-2">
					{(task.assignees || []).map(
						(assigned: TaskAssignment, index: number) => (
							<AppAvatar username={assigned.user_fullname} key={index} />
						)
					)}
				</div>
			</div>
			<PriorityTag variant={task.priority}>
				{priorityTagText[task.priority]}
			</PriorityTag>
		</div>
	);
}
