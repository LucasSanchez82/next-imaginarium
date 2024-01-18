import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import eventSchema, { CalendarEvent } from "@/components/zodSchemas/event";
import { EventImpl } from "@fullcalendar/core/internal";
import { Trash2 } from "lucide-react";
import { use, useEffect } from "react";
import AutoForm from "../auto-form";
import { updateEvenementToDb } from "@/components/actions/edt";
import { toast } from "../use-toast";

export function AddEventModal({
  open,
  setOpen,
  addCalendarEvent,
  useUpdateEvent,
  useDates,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addCalendarEvent: (event: CalendarEvent) => Promise<void>;
  useUpdateEvent: {
    updateEvent: EventImpl | null;
    setUpdate: (event: EventImpl) => Promise<void>;
  };
  useDates: {
    dates: { start: Date; end?: Date };
    setDates: (dates: { start: Date; end?: Date }) => void;
  };
}) {
  const { updateEvent, setUpdate: updateEventReset } = useUpdateEvent;
  const { dates, setDates } = useDates;
  useEffect(() => {
    console.log('useEffect updateEvent : \n', updateEvent);
  }, [updateEvent, useUpdateEvent]);

  // useEffect(() => {
  //   if (!open) {
  //     updateEventReset();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [open]);
  const handleSubmit = async (values: CalendarEvent) => {
    if (updateEvent?.title) {
      const {
        end: dateFin,
        start: dateDebut,
        title: titre,
        description,
        id,
      } = values;
      if (id) {
        // * UPDATE
        updateEvent.setProp("title", values.title);
        updateEvent.setExtendedProp("description", values.description);
        updateEvent.setStart(values.start);
        updateEvent.setEnd(values.end);
        updateEvenementToDb(
          {
            dateDebut,
            dateFin,
            titre,
            id,
            description: values.description || null,
          },
          "/(connected)/enfants/[idEnfant]/edt/"
        );
      } else {
        toast({
          title: "Erreur",
          description: "Il manque l'id de l'évènement",
          variant: "destructive",
        });
      }
    } else {
      // * CREATE
      await addCalendarEvent({ ...values });
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {updateEvent ? "Modifier l'évènement" : "Ajouter un évènement"}
          </DialogTitle>
        </DialogHeader>
        <AutoForm
          formSchema={eventSchema}
          onSubmit={(e) =>
            handleSubmit({
              ...e,
              description: e.description || null,
              id: Number(updateEvent?._def.publicId) || undefined,
            })
          }
          values={{
            title: updateEvent?._def.title,
            description: updateEvent?._def.extendedProps.description,
            start: dates.start,
            end: dates.end,
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
            {updateEvent && (
              <Button type="button">
                <Trash2 color="#e22222" />
              </Button>
            )}

            <Button type="submit">Sauvegarder les changements</Button>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
