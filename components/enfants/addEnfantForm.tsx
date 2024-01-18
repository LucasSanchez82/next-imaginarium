"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { toast } from "@/components/ui/use-toast";
import { addEnfantSchema, enfantSchema } from "@/types/enfantSchemas";
import { addEnfantType, enfantType } from "@/types/enfantType";
import React, { Dispatch, SetStateAction } from "react";

const AddEnfantForm = ({setOpen}: {setOpen: Dispatch<SetStateAction<boolean>>}) => {
  const handleSubmit = async (values: addEnfantType) => {
    const [day, month, year] = values.dateNaissance.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const newValues: enfantType = {...values, dateNaissance: date};
    const safeValues = enfantSchema.safeParse(newValues);

    if(safeValues.success){
      const { data } = safeValues;
      
      const response = await fetch('/api/enfants', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const res = await response.json();
      if(response.ok){
        setOpen(false);
        toast({
          variant: 'default',
          title: res.success || 'Enfant ajouté'
        })
      }else {
        toast({
          variant: 'destructive',
          title: "Erreur",
          description: res.error || 'Erreur serveur',
        })
      }
      
    }else {
      toast({
        variant: 'destructive',
        title: 'Informations enfant corrompu',
        description: safeValues.error.message || ','
      })
    }
      
  };
  return (
    <AutoForm
      formSchema={addEnfantSchema}
      onSubmit={handleSubmit}
      className="w-2/4 m-auto"
    >
      <AutoFormSubmit>Ajouter un enfant</AutoFormSubmit>
    </AutoForm>
  );
};

export default AddEnfantForm;
