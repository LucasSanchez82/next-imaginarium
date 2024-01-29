"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import eventSchema, { CalendarEvent } from "@/components/zodSchemas/event";
import { EventImpl } from "@fullcalendar/core/internal";
import { Categorie } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import AutoForm from "../auto-form";
import { toast } from "../use-toast";
import { CategorieRadioForm } from "./categorieRadioForm";

const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending, data } = useFormStatus();
  const value = children ?? "Ajouter";
  return (
    <Button aria-disabled={pending} type="submit">
      {pending ? "..." : value}
    </Button>
  );
};

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
  useEffect(() => {
    console.log({ updateEvent: props.updateEvent })
  }, [categorie])
  const handleAction = async (e: FormData) => {
    const obj = Object.fromEntries(e);
    const { start, end, description, title, ...other } = obj;

    const parsedEvent = eventSchema.safeParse({
      description,
      title,
      start: props.dates.start,
      end: props.dates.end,
    });

    if (parsedEvent.success) {
      const { start, end, description, title } = parsedEvent.data;
      console.log("categorie", categorie);
      try {
        await props.handleAddUpdateEvent({
          end,
          start,
          description,
          title,
          id: Number(props.updateEvent?._def.publicId) || undefined,
          idCategorie: Number(categorie) || undefined,
        });
      } catch (error) {
        toast({
          title: "Erreur, impossible d'ajouter l'évènement",
          description: "Erreur coté serveur",
          variant: "destructive",
        });
      }
    } else {
      console.error(parsedEvent.error);
    }
  };
  return (
    <>
      <AutoForm
        onValuesChange={(values) =>
          values.start &&
          values.end &&
          props.setDates({
            start: new Date(values.start),
            end: new Date(values.end),
          })
        }
        formSchema={eventSchema}
        onSubmit={(e) => {
          console.log("submit", e);
        }}
        action={handleAction}
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
          categorie={categorie}
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
