"use client";

import { addCategorieToDb } from "@/components/actions/categorie";
import AutoForm from "@/components/ui/auto-form";
import { categorieSchema } from "./zodSchemas";
import { SubmitButton } from "./submitButton";
import { Button } from "@/components/ui/button";

const Form = ({ className }: { className?: string }) => {
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
      }}
    >
      <Button type="submit">Envoyer</Button>
    </AutoForm>
  );
};

export default Form;
