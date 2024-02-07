"use client";
import { resetPassword } from "@/components/actions/compte";
import { SubmitButton } from "@/components/submitButton";
import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { confirmPasswordSchema } from "@/components/zodSchemas/compteSchema";
import { useState } from "react";

export function SheetChangePassword() {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Modifier mot de passe</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier le mot de passe</SheetTitle>
        </SheetHeader>
        <AutoForm
          parsedAction={async (values) => {
            if (!error) {
              console.log("action");
              try {
                const response = await resetPassword(values);
                setOpen(false);
                toast({
                  title:
                    response || "Bizzare, message indefinit et pas d'erreur 🤷‍♂️",
                });
              } catch (error) {
                toast({
                  title:
                    error instanceof Error
                      ? error.message
                      : "Erreur serveur lors de la modificatino du mot de passe",
                  variant: "destructive",
                });
              }
            }
          }}
          onValuesChange={(values) => {
            console.log("‼️ !!");
            if (values.newPassword === values.confirmPassword) {
              setError(null);
            } else {
              setError("Les mots de passe ne correspondent pas.");
            }
          }}
          formSchema={confirmPasswordSchema}
          fieldConfig={{
            confirmPassword: {
              inputProps: {
                type: "password",
              },
            },
            newPassword: {
              inputProps: {
                type: "password",
              },
            },
            oldPassword: {
              inputProps: {
                type: "password",
              },
            },
          }}
          className="grid gap-4 py-4"
        >
          <SheetFooter>
            <SheetClose asChild>
              <SubmitButton
                buttonProps={{ disabled: !!error }}
                classname="w-full"
              >
                {error ? (
                  <strong className="text-red-800 w-full text-center">
                    {error}
                  </strong>
                ) : (
                  "Changer le mot de passe"
                )}
              </SubmitButton>
            </SheetClose>
          </SheetFooter>
        </AutoForm>
      </SheetContent>
    </Sheet>
  );
}
