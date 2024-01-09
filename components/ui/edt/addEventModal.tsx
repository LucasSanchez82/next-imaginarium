import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import eventSchema, { CalendarEvent } from "@/components/zodSchemas/event";
import { EventInput } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import { useEffect } from "react";
import AutoForm from "../auto-form";
import { Trash2 } from "lucide-react";

export function AddEventModal({
  open,
  setOpen,
  addCalendarEvent,
  useUpdateEvent,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addCalendarEvent: (event: EventInput) => void;
  useUpdateEvent: {
    updateEvent: EventImpl | null;
    updateEventReset: () => void;
  };
}) {
  const { updateEvent, updateEventReset } = useUpdateEvent;

  useEffect(() => {
    if (!open) {
      console.log("ferme");
      updateEventReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (values: CalendarEvent) => {
    if (updateEvent?.title) {
      updateEvent.setProp("title", values.title);
      updateEvent.setExtendedProp("description", values.description);
    } else {
      addCalendarEvent({ ...values });
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
          onSubmit={handleSubmit}
          values={{
            title: updateEvent?._def.title,
            description: updateEvent?._def.extendedProps.description,
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
          }}
        >
          <DialogFooter className=" w-full flex items-around justify-around">
            {updateEvent && (
              <Button type="button" onClick={() => {
                console.log("supprimer");
              }}>
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
