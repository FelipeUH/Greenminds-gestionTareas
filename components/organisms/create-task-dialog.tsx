import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "../ui/dialog";
import { ButtonWithIcon } from "../atoms/button-with-icon";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ComboBox } from "./combobox";
import { PlusSquare, Save, X } from "lucide-react";
import { Item } from "./combobox";

const priorities: Item[] = [
  {
    value: "high",
    label: "Alta",
  },
  {
    value: "medium",
    label: "Media",
  },
  {
    value: "low",
    label: "Baja",
  },
];
const nullText: string = "Establecer prioridad";
// priorities y nullText son atributos necesarios para el componente ComboBox

export function CreateTaskDialog() {
  return (
    <Dialog>
      {/* BOTON QUE ACTIVA EL DIALOG */}
      <DialogTrigger asChild>
        <ButtonWithIcon variant="default" Icon={PlusSquare}>
          Crear Tarea
        </ButtonWithIcon>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[734px] bg-primary"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Crear nueva tarea</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-name">Título</Label>
            <Input id="task-name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-responsible">Encargados</Label>
            <Input id="task-responsible" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-priority">Prioridad</Label>
            <ComboBox items={priorities} nullText={nullText} />
          </div>
        </div>
        <div className="flex flex-row gap-2" data-slot="dialog-footer">
          <ButtonWithIcon
            variant="default"
            type="submit"
            className="text-primary"
            Icon={Save}
          >
            Guardar proyecto
          </ButtonWithIcon>
          <DialogClose asChild>
            <ButtonWithIcon
              variant="destructive"
              type="button"
              className="text-primary"
              Icon={X}
            >
              Cancelar
            </ButtonWithIcon>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
