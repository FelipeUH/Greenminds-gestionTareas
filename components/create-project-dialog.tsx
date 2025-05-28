import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PlusSquare, Save, X } from "lucide-react";

export function CreateProjectDialog() {
  return (
    <Dialog>
      {/* BOTON QUE ACTIVA EL DIALOG */}
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusSquare />
          Crear Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[734px] bg-primary" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Nombre del proyecto</Label>
            <Input id="project-name" className="" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea id="project-description"/>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-endDate">Fecha de finalización</Label>
            <Input id="project-endDate" type="date" className="" />
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
