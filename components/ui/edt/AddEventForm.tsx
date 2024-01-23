"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import eventSchema, { CalendarEvent } from "@/components/zodSchemas/event";
import { EventImpl } from "@fullcalendar/core/internal";
import { Trash2 } from "lucide-react";
import AutoForm from "../auto-form";
import { toast } from "../use-toast";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";

const SubmitButton = () => {
  const { pending, data } = useFormStatus();
  useEffect(() => console.log(data), [data])
  return <Button aria-disabled={pending} type="submit">{pending ? "..." : "Ajouter"}</Button>;
};

export function AddEventForm(props: {
  updateEvent: EventImpl | null;
  dates: {
    start: Date;
    end?: Date;
  };
  setDates: (dates: { start: Date; end?: Date }) => void;
  handleSubmit: (values: CalendarEvent) => Promise<void>;
  handleDelete: () => Promise<void>;
}) {
  return (
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
      action={async (e) => {
        console.log(Object.fromEntries(e));
        console.log(e.get("start"));
        const parsedEvent = eventSchema.safeParse({
          ...Object.fromEntries(e),
          start: props.dates.start,
          end: props.dates.end,
        });

        if (parsedEvent.success) {
          try {
            await props.handleSubmit({
              ...parsedEvent.data,
              description: parsedEvent.data.description || null,
              id: Number(props.updateEvent?._def.publicId) || undefined,
            })
          }catch(error){
            toast({
              title: "Erreur, impossible d'ajouter l'évènement",
              description: 'Erreur coté serveur',
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erreur, structure de l'évènement invalide",
            description: parsedEvent.error.issues.map((issue,key) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-semibold">
                  {issue.path.join(".")}
                </span>
                <span className="text-xs">{issue.message}</span>
              </div>
            )),
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
      <DialogFooter className=" w-full flex items-around justify-around">
        {props.updateEvent && (
          <Button type="button" onClick={props.handleDelete}>
            <Trash2 color="#e22222" />
          </Button>
        )}

        <SubmitButton />
      </DialogFooter>
    </AutoForm>
  );
}
