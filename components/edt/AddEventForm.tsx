"use client";
import { SubmitButton } from "@/components/submitButton";
import { DialogFooter } from "@/components/ui/dialog";
import eventSchema, { CalendarEvent } from "@/components/zodSchemas/event";
import { EventImpl } from "@fullcalendar/core/internal";
import { Categorie } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import AutoForm from "../ui/auto-form";
import { toast } from "../ui/use-toast";
import { CategorieRadioForm } from "./categorieRadioForm";

export function AddEventForm(props: {
  updateEvent: EventImpl | null;
  dates: {
    start: Date;
    end?: Date;
  };
  setDates: (dates: { start: Date; end?: Date }) => void;
  handleAddUpdateEvent: (values: CalendarEvent) => Promise<void>;
  handleDelete: () => Promise<void>;
  categories: Categorie[];
}) {
  const [categorie, setCategorie] = useState<string | null>(null);
  return (
    <>
      <AutoForm
        formSchema={eventSchema}
        parsedAction={async (values) => {
          try {
            await props.handleAddUpdateEvent({
              ...values,
              id: Number(props.updateEvent?._def.publicId) || undefined,
              idCategorie: Number(categorie) || undefined,
            });
          } catch (error) {
            console.error("addEventForm", error);
            toast({
              title:
                error instanceof Error
                  ? error.message
                  : "Erreur, impossible d'ajouter l'évènement coté serveur",
              variant: "destructive",
            });
          }
        }}
        values={{
          title: props.updateEvent?._def.title,
          description: props.updateEvent?._def.extendedProps.description,
          start: props.dates.start,
          end: props.dates.end,
        }}
        fieldConfig={{
          title: {
            inputProps: {
              placeholder: "Mon titre...",
              required: false,
              minLength: undefined,
            },
          },
          description: {
            fieldType: "textarea",
            inputProps: {
              placeholder: "Ma description...",
              required: false,
            },
          },
          start: {
            fieldType: "datetime",
            inputProps: {
              required: false,
            },
          },
          end: {
            fieldType: "datetime",
            inputProps: {
              required: false,
            },
          },
        }}
      >
        <CategorieRadioForm
          setCategorie={setCategorie}
          categories={props.categories}
        />
        <DialogFooter className=" w-full flex items-around justify-around">
          <SubmitButton>
            {props.updateEvent ? "Modifier" : "Ajouter"}
          </SubmitButton>
        </DialogFooter>
      </AutoForm>

      {/* Delete form */}
      {props.updateEvent && (
        <form action={props.handleDelete} className="text-center">
          <SubmitButton>
            <Trash2 color="#e22222" />
          </SubmitButton>
        </form>
      )}
    </>
  );
}
