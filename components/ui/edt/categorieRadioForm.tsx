"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { get } from "http";
import { getCategoriesFromDb } from "@/components/actions/categorie";
import { set } from "date-fns";

export function CategorieRadioForm({
  categorie,
  setCategorie,
}: {
  categorie: string | null;
  setCategorie: (categories: string) => void;
}) {
  const [allCategoriesFromDb, setAllCategoriesFromDb] = useState<
    string[] | null
  >(null);
  useEffect(() => {
    getCategoriesFromDb().then((categories) =>
      setAllCategoriesFromDb(categories.map((categorie) => categorie.libelle))
    );
  }, []);
  return (
      <form
        onChange={(e) =>
          e.target instanceof HTMLInputElement && console.log(e.target.value)
        }
        className="w-2/3 space-y-6"
      >
        <FormField
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => setCategorie(value)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {
                    allCategoriesFromDb?.map((categorie) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={categorie} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {categorie}
                        </FormLabel>
                      </FormItem>
                    ))
                  }
                  <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={'null'} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          'aucune'
                        </FormLabel>
                      </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
  );
}
