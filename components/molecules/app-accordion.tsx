import { TaskCard } from "@/components/molecules/task-card";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { AccordionTrigger } from "@/components/atoms/accordion-trigger";

// Tipo de tareas
type TaskExamples = {
    taskTitle: string;
    assignedUsers: string[];
    priorityLevel: "high" | "medium" | "low";
    taskState: "unassigned" | "assigned" | "done";
}

interface AppAccordionProps {
    tasks: TaskExamples[];
}

export const AppAccordion = ({ tasks }: AppAccordionProps) => {
    const unassignedTasks = tasks.filter(task => task.taskState === "unassigned");
    const assignedTasks = tasks.filter(task => task.taskState === "assigned");
    const doneTasks = tasks.filter(task => task.taskState === "done");

    return (
        <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Sin Asignar</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    {unassignedTasks.map((task, index) => (
                        <TaskCard
                            taskTitle={task.taskTitle}
                            assignedUsers={task.assignedUsers}
                            priorityLevel={task.priorityLevel}
                            key={index}
                        />
                    ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Asignadas</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    {assignedTasks.map((task, index) => (
                        <TaskCard
                            taskTitle={task.taskTitle}
                            assignedUsers={task.assignedUsers}
                            priorityLevel={task.priorityLevel}
                            key={index}
                        />
                    ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Terminadas</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    {doneTasks.map((task, index) => (
                        <TaskCard
                            taskTitle={task.taskTitle}
                            assignedUsers={task.assignedUsers}
                            priorityLevel={task.priorityLevel}
                            key={index}
                        />
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};