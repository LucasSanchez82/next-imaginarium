import { deleteCompteFromDb } from "@/components/actions/compte";
import { SubmitButton } from "@/components/submitButton";
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

export function DeleteDialog({id}: {id: string}) {
  const { toast } = useToast();
  return (
    <Dialog>
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
            } catch (error) {
              toast({
                title:
                  typeof error === "string"
                    ? error
                    : "Erreur lors de la suppression",
                variant: "destructive",
              });
            }
          }}
        >
          <DialogFooter>
            <SubmitButton>
              <Trash2 color="#b72424" />
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
