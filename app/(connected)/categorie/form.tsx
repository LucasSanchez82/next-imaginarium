"use client";

import { addCategorieToDb } from "@/components/actions/categorie";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { categorieSchema } from "./zodSchemas";
import { useToast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/submitButton";

const FormCategorie = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  return (
    <AutoForm
      // action={addCategorieToDb}
      parsedAction={async (values) => {
        try {
          await addCategorieToDb(values);
        } catch (error) {
          console.error("FormCategorie", error);
          toast({
            title:
              error instanceof Error
                ? error.message
                : "Erreur, impossible d'ajouter la catégorie coté serveur",
            variant: "destructive",
          });
        }
      }}
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
      <SubmitButton>Ajouter</SubmitButton>
    </AutoForm>
  );
};

export default FormCategorie;
