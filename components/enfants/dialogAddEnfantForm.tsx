"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { addEnfantSchema, enfantSchema } from "@/types/enfantSchemas";
import { addEnfantType, enfantType } from "@/types/enfantType";
import { useState } from "react";
export function DialogAddEnfantForm({
  reloadVisibleEnfants,
}: {
  reloadVisibleEnfants: (refreshNbPages?: boolean) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: addEnfantType) => {
    const [day, month, year] = values.dateNaissance.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const newValues: enfantType = { ...values, dateNaissance: date };
    const safeValues = enfantSchema.safeParse(newValues);

    if (safeValues.success) {
      const { data } = safeValues;

      const response = await fetch("/api/enfants", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (response.ok) {
        setOpen(false);
        await reloadVisibleEnfants();
        toast({
          variant: "default",
          title: res.success || "Enfant ajouté",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: res.error || "Erreur serveur",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Informations enfant corrompu",
        description: safeValues.error.message || ",",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter Enfant</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>Ajouter un enfant :</DialogHeader>
        <AutoForm
          formSchema={addEnfantSchema}
          onSubmit={handleSubmit}
          className="w-2/4 m-auto"
        >
          <AutoFormSubmit>Ajouter un enfant</AutoFormSubmit>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
