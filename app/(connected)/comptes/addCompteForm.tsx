"use client"
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
    DialogTrigger
} from "@/components/ui/dialog";
import { addCompteSchema } from "@/components/zodSchemas/compteSchema";
import { useState } from "react";

export function AddEnfantFormDialog() {
    const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un compte</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un enfant</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        <AutoForm action={addCompteToDb} formSchema={addCompteSchema}>
          <DialogFooter>
            <SubmitButton onload={() => setOpen(false)}>Soumettre</SubmitButton>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
