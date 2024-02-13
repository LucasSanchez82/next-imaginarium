"use client";


import { useStoreCategorie } from "@/app/(connected)/enfants/[idEnfant]/edt/useStoreCategorie";
import { getCategoriesFromDb } from "@/components/actions/categorie";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Categorie } from "@prisma/client";
import { useEffect, useState } from "react";

export function CategorieRadioForm({
  categories,
  setCategorie,
}: {
  categories: Categorie[];
  setCategorie: (categorie: string) => void;
}) {
  const [allCategoriesFromDb, setAllCategoriesFromDb] = useState<
    string[] | null
  >(null);
  const {categorie} = useStoreCategorie()
  useEffect(() => {
    setCategorie(categorie?.id ? String(categorie?.id) : '')
    getCategoriesFromDb().then((categories) =>
      setAllCategoriesFromDb(categories.map((categorie) => categorie.libelle))
    );
  }, []);
  return (
      <form
        onChange={(e) =>
          e.target instanceof HTMLInputElement && setCategorie(e.target.value)
        }
        className="w-2/3 space-y-6"
      >
        <FormField
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Categorie : </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => setCategorie(value)}
                  defaultValue={categorie?.id ? String(categorie.id) : ''}
                  className="flex flex-col space-y-1"
                >
                  {
                    categories.map((categorie, key) => (
                      <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={String(categorie.id)} />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <div className="rounded w-2 h-2 mr-1" style={{backgroundColor: categorie.couleur || '#3788d8'}}></div> <div>{categorie.libelle} {(categorie.important && '⚠️')}</div>
                        </FormLabel>
                      </FormItem>
                    ))
                  }
                  <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={''} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {'aucune'}
                        </FormLabel>
                      </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
  );
}
