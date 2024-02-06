"use client";
import { editCompteToDb } from "@/components/actions/compte";
import { SubmitButton } from "@/components/submitButton";
import { UseOpenType } from "@/components/types/useOpenType";
import AutoForm from "@/components/ui/auto-form";
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
import { editCompteSchema } from "@/components/zodSchemas/compteSchema";
import { User } from "@prisma/client";
import { Edit } from "lucide-react";
import { useState } from "react";

export function EditEnfantFormDialog({ compte }: { compte: User;}) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editer un compte : </DialogTitle>
        </DialogHeader>
        <AutoForm
          parsedAction={async (values) => {
            try {
              await editCompteToDb({...values, id: compte.id });
              setOpen(false);
            } catch (error) {
              console.error("editCompteDialog -> action", error);
              toast({
                variant: "destructive",
                title:
                  error instanceof Error
                    ? error.message
                    : "Erreur lors de la modification coté serveur",
              });
            }
          }}
          values={{
            name: compte.name,
            email: compte.email,
            isAdmin: compte.isAdmin,
            isVerified: compte.isVerified,
          }}
          formSchema={editCompteSchema}
        >
          <DialogFooter>
            <SubmitButton classname="w-full">Editer</SubmitButton>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
