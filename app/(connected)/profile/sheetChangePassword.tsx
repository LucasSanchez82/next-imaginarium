"use client";
import { SubmitButton } from "@/components/submitButton";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { confirmPasswordSchema } from "@/components/zodSchemas/compteSchema";
import { ChangeEvent, FormEvent, FormEventHandler } from "react";
import { z } from "zod";

export function SheetChangePassword() {
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Modifier mot de passe</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier le mot de passe</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
        </SheetHeader>
        <AutoForm onParsedValuesChange={(values) => {
            console.log(values);
        }} formSchema={confirmPasswordSchema} className="grid gap-4 py-4">
          <SheetFooter>
            <SheetClose asChild>
              <SubmitButton classname="w-full">
                Changer le mot de passe
              </SubmitButton>
            </SheetClose>
          </SheetFooter>
        </AutoForm>
      </SheetContent>
    </Sheet>
  );
}
