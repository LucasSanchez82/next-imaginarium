import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import eventSchema from "@/components/zodSchemas/event";
import { EventInput } from "@fullcalendar/core/index.js";
import AutoForm from "../auto-form";

export function AddEventModal({
  open,
  setOpen,
  addCalendarEvent,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addCalendarEvent: (event: EventInput) => void
}) {
  const handleSubmit = (values: { title: string; description: string }) => {
    // console.log({ ...values, date: date.toLocaleString() });
    addCalendarEvent({...values})
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
        <AutoForm formSchema={eventSchema} onSubmit={handleSubmit}>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
