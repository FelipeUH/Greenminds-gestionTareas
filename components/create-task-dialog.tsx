import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ComboBox } from "./combobox";
import { PlusSquare, Save, X } from "lucide-react";
import { Item } from "./combobox";

const priorities: Item[] = [
  {
    value: "high",
    label: "Alta"
  },
  {
    value: "medium",
    label: "Media"
  },
  {
    value: "low",
    label: "Baja"
  },
]
const nullText : string = "Establecer prioridad"
// priorities y nullText son atributos necesarios para el componente ComboBox

export function CreateTaskDialog() {
  return (
    <Dialog>
      {/* BOTON QUE ACTIVA EL DIALOG */}
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusSquare />
          Crear Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[734px] bg-primary" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Crear nueva tarea</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-name">Título</Label>
            <Input id="task-name" className="" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-responsible">Encargados</Label>
            <Input id="task-responsible" className="" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-priority">Prioridad</Label>
            <ComboBox items={priorities} nullText={nullText}/>
          </div>
        </div>
        <div className="flex flex-row gap-2" data-slot="dialog-footer">
          <Button variant="default" type="submit" className="text-primary">
            <Save />
            Guardar proyecto
          </Button>
          <DialogClose asChild>
            <Button
              variant="destructive"
              type="button"
              className="text-primary"
            >
              <X />
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
