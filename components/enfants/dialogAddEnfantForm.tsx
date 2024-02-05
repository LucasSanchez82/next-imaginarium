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
import { SubmitButton } from "../submitButton";
import { log } from "console";
import { addEnfantServer } from "../actions/enfant";
import { fi } from "date-fns/locale";
export function DialogAddEnfantForm() {
  const [open, setOpen] = useState(false);

  const removeNull = <T extends object>(obj: T): T => {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== "") {
        newObj[key] = value;
      }
    }
    return newObj;
  };
  const handleAction = async (formdata: FormData) => {
    const obj = Object.fromEntries(formdata.entries());
    console.log(obj);

    const values = removeNull(obj as addEnfantType);
    const [day, month, year] = values.dateNaissance.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const newValues: enfantType = { ...values, dateNaissance: date };
    const safeValues = enfantSchema.safeParse(newValues);

    if (safeValues.success) {
      try {
        await addEnfantServer(safeValues.data);
      } catch (error) {
        console.log("🚀 ~ handleAction ~ error:", error);
      } finally {
        setOpen(false);
      }
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
          action={handleAction}
          className="w-2/4 m-auto"
        >
          <SubmitButton>Ajouter un enfant</SubmitButton>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
