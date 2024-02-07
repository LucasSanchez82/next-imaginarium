import { deleteCompteFromDb } from "@/components/actions/compte";
import { SubmitButton } from "@/components/submitButton";
import { UseOpenType } from "@/components/types/useOpenType";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteDialog({id}: {id: string}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 color="#b72424" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer</DialogTitle>
        </DialogHeader>
        <form
          action={async () => {
            try {
              await deleteCompteFromDb(id);
              setOpen(false);
            } catch (error) {
              toast({
                title:
                    error instanceof Error
                    ? error.message
                    : "Erreur Inconnu lors de la suppression",
                variant: "destructive",
              });
            }
          }}
        >
          <DialogFooter>
            <SubmitButton className="w-full">
              <Trash2 color="#b72424" />
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
