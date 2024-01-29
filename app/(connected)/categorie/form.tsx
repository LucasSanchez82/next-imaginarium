"use client";

import { addCategorieToDb } from "@/components/actions/categorie";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { categorieSchema } from "./zodSchemas";

const FormCategorie= ({ className }: { className?: string }) => {
  return (
    <AutoForm
      action={addCategorieToDb}
      className={className}
      formSchema={categorieSchema}
      fieldConfig={{
        description: {
          fieldType: "textarea",
        },
        color: {
          inputProps: {
            type: "color",
          },
        },
        important: {
          fieldType: "switch",
        },
      }}
    >
      <Button type="submit">Envoyer</Button>
    </AutoForm>
  );
};

export default FormCategorie;
