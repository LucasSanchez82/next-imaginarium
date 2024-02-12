"use client";
import { deleteCategorieFromDb } from "@/components/actions/categorie";
import { SubmitButton } from "@/components/submitButton";
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
import { Categorie } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteCategorieButton({
  categorie,
}: {
  categorie: Pick<Categorie, "id" | "libelle">;
}) {
    const {toast} = useToast()
    const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="m-1">
          <Trash2 className="text-red-800" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
                Supprimer la categorie : {categorie.libelle}
          </DialogTitle>
        </DialogHeader>
        <form action={async () => {
            try {
                await deleteCategorieFromDb(categorie.id)
            } catch(error) {
                toast({
                    title: "Erreur",
                    description: error instanceof Error ? error.message: "Erreur inconnue lors de la suppression de la categorie",
                    variant: 'destructive'
                
                })
            }finally {
                setOpen(false)
            }
        }}>
          <DialogFooter>
            <SubmitButton>Supprimer</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
