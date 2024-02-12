"use client";
import { categorieSchema } from "@/app/(connected)/categorie/zodSchemas";
import { SubmitButton } from "@/components/submitButton";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { Categorie, CategorieTag, Tag } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { upSertCategorieToDb } from "@/components/actions/categorie";

const EditCategorieButton = ({
  categorie,
}: {
  categorie: Categorie & { tags: (CategorieTag & { tag: Tag })[] };
}) => {
  const [open, setOpen] = useState(false);
  const {toast} = useToast()
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className=" overflow-y-scroll h-5/6 max-w-7xl">
        <DialogHeader>
          <DialogTitle>Modifier la categorie : {categorie.libelle}</DialogTitle>
        </DialogHeader>
        <AutoForm
        parsedAction={async (categorieObj) => {
            try {
                await upSertCategorieToDb(categorieObj, categorie.id)
                setOpen(false)
            } catch(error) {
                toast({
                    title: "Erreur",
                    description: error instanceof Error ? error.message: "Erreur inconnue lors de la modification de la categorie",
                    variant: 'destructive'
                
                })
            }
        }}
          formSchema={categorieSchema}
          values={{
            color: categorie.couleur || undefined,
            description: categorie.description || undefined,
            important: categorie.important,
            libelle: categorie.libelle,
            tags: categorie.tags.map((tag) => ({ libelle: tag.tag.libelle })),
          }}
        >
            <SubmitButton className="w-full">Modifier</SubmitButton>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategorieButton;
