import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useDialog } from "@/context/DialogContext";

export function GenericDialog() {
  const { dialogOpen, dialogContent, closeDialog } = useDialog();

  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px] bg-primary">
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
          <DialogDescription>{dialogContent?.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" className="bg-[#0F172A] text-primary">
              Continuar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
