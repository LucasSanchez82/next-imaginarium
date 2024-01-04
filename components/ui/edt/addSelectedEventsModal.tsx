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

export function AddSelectedEventsModal({
  open,
  setOpen,
  date,
  addCalendarEvent,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: Date;
  addCalendarEvent: (event: EventInput) => void
}) {
  const handleSubmit = (values: { title: string; description: string }) => {
    console.log({ ...values, date: date.toLocaleString() });
    addCalendarEvent({...values})
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          {/* <DialogDescription> 
           </DialogDescription> */}
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
