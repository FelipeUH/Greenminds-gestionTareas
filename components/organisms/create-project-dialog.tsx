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
import { Textarea } from "../ui/textarea";
import { PlusSquare, Save, X } from "lucide-react";

export function CreateProjectDialog() {
  return (
    <Dialog>
      {/* BOTON QUE ACTIVA EL DIALOG */}
      <DialogTrigger asChild>
        <ButtonWithIcon Icon={PlusSquare} variant="default">
          Crear Proyecto
        </ButtonWithIcon>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[734px] bg-primary" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Nombre del proyecto</Label>
            <Input id="project-name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea id="project-description"/>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-endDate">Fecha de finalización</Label>
            <Input id="project-endDate" type="date" />
          </div>
        </div>
        <div className="flex flex-row gap-2" data-slot="dialog-footer">
          <ButtonWithIcon Icon={Save} variant="default" type="submit" className="text-primary">
            Guardar proyecto
          </ButtonWithIcon>
          <DialogClose asChild>
            <ButtonWithIcon
              Icon={X}
              variant="destructive"
              type="button"
              className="text-primary"
            >
              Cancelar
            </ButtonWithIcon>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
