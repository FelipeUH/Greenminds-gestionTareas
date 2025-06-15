import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";
import { CreateTaskDialog } from "@/components/organisms/create-task-dialog";
import { AppAccordion } from "@/components/molecules/app-accordion";

// Ejemplos de tareas - POR CAMBIAR
type TaskExamples = {
    taskTitle: string;
    assignedUsers: string[];
    priorityLevel: "high" | "medium" | "low";
    taskState: "unassigned" | "assigned" | "done";
}

const taskExamples: TaskExamples[] = [
    {
        taskTitle: "Lorem ipsum",
        assignedUsers: ["JUAN", "MARIA", "CARLOS"],
        priorityLevel: "high",
        taskState: "unassigned"
    },
    {
        taskTitle: "Dolor sit amet",
        assignedUsers: ["JUAN", "MARIA"],
        priorityLevel: "medium",
        taskState: "assigned"
    },
    {
        taskTitle: "Consectetur adipiscing elit",
        assignedUsers: ["CARLOS"],
        priorityLevel: "low",
        taskState: "done"
    },
    {
        taskTitle: "Sed do eiusmod tempor",
        assignedUsers: ["JUAN"],
        priorityLevel: "high",
        taskState: "assigned"
    },
    {
        taskTitle: "Lorem ipsum",
        assignedUsers: ["JUAN", "MARIA", "CARLOS"],
        priorityLevel: "high",
        taskState: "unassigned"
    },
    {
        taskTitle: "Dolor sit amet",
        assignedUsers: ["JUAN", "MARIA"],
        priorityLevel: "medium",
        taskState: "assigned"
    },
    {
        taskTitle: "Consectetur adipiscing elit",
        assignedUsers: ["CARLOS"],
        priorityLevel: "low",
        taskState: "done"
    },
    {
        taskTitle: "Sed do eiusmod tempor",
        assignedUsers: ["JUAN"],
        priorityLevel: "high",
        taskState: "assigned"
    },
    {
        taskTitle: "Dolor sit amet",
        assignedUsers: ["JUAN", "MARIA"],
        priorityLevel: "medium",
        taskState: "assigned"
    },
    {
        taskTitle: "Consectetur adipiscing elit",
        assignedUsers: ["CARLOS"],
        priorityLevel: "low",
        taskState: "done"
    },
    {
        taskTitle: "Sed do eiusmod tempor",
        assignedUsers: ["JUAN"],
        priorityLevel: "high",
        taskState: "assigned"
    },
];

export default function BacklogPage() {
    return (
        <ProjectLayout>
            <div className="flex flex-col p-12">
                <div className="flex justify-between">
                    <Title>Backlog</Title>
                    <CreateTaskDialog />
                </div>
                <AppAccordion tasks={taskExamples} />
            </div>
        </ProjectLayout>
    );
}
