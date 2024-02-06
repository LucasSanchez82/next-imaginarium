"use client";
import { addCompteToDb } from "@/components/actions/compte";
import { SubmitButton } from "@/components/submitButton";
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
import { addCompteSchema } from "@/components/zodSchemas/compteSchema";
import { useState } from "react";

export function AddEnfantFormDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="m-auto" asChild >
        <Button variant="outline" >Ajouter un compte</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un compte</DialogTitle>
        </DialogHeader>
        <AutoForm
          action={async (formdata) => {
            try {
              await addCompteToDb(formdata);
              setOpen(false);
            } catch (error) {
              console.error("AddEnfantFormDialog -> action", error);
              toast({
                title:
                  error instanceof Error
                    ? error.message
                    : "Erreur lors de l'ajout coté serveur",
                variant: "destructive",
              });
            }
          }}
          formSchema={addCompteSchema}
        >
          <DialogFooter>
            <SubmitButton>Soumettre</SubmitButton>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
