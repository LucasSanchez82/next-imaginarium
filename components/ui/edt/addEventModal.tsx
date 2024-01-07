import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import eventSchema from "@/components/zodSchemas/event";
import { EventInput } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import AutoForm from "../auto-form";
import { use, useEffect } from "react";

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

  const handleSubmit = (values: { title: string; description: string }) => {
    addCalendarEvent({ ...values });
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
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <AutoForm
          formSchema={eventSchema}
          onSubmit={handleSubmit}
          fieldConfig={{
            title: {
              description: "The title of the event.",
              fieldType: "fallback",
              inputProps: {
                placeholder: "Mon titre...",
                defaultValue: updateEvent?._def.title,
              },
            },
            description: {
              description: "The description of the event.",
              fieldType: "textarea",
              inputProps: {
                placeholder: "Ma description...",
                defaultValue: updateEvent?._def.extendedProps.description,
              },
            },
          }}
        >
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
