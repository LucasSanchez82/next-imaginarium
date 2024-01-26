import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEvent } from "@/components/zodSchemas/event";
import { dateResetOffset } from "@/lib/dateUtils";
import { EventImpl } from "@fullcalendar/core/internal";
import { Categorie, Evenement } from "@prisma/client";
import { toast } from "../use-toast";
import { AddEventForm } from "./AddEventForm";
import { useEffect } from "react";

export function AddEventModal({
  open,
  setOpen,
  addCalendarEvent,
  useUpdateEvent,
  useDates,
  deleteCalendarEvent,
  updateEvenementToDb,
  categories,
}: {
  open: boolean;
  categories: Categorie[];
  setOpen: (open: boolean) => void;
  addCalendarEvent: (event: CalendarEvent) => Promise<void>;
  useUpdateEvent: {
    updateEvent: EventImpl | null;
    resetUpdate: () => void;
  };
  useDates: {
    dates: { start: Date; end?: Date };
    setDates: (dates: { start: Date; end?: Date }) => void;
  };
  deleteCalendarEvent: () => Promise<void>;
  updateEvenementToDb: (
    evenement: Omit<Evenement, "idEnfant" | "idJour">,
    path?: string
  ) => Promise<{
    id: number;
    dateDebut: Date;
    dateFin: Date;
    titre: string;
    description: string | null;
    idJour: number;
    idEnfant: number;
  }>;
}) {
  const { updateEvent, resetUpdate } = useUpdateEvent;
  const { dates, setDates } = useDates;
  useEffect(() => {
    if (!open) {
      resetUpdate();
    }
  }, [open]);
  const handleAddUpdateEvent = async (values: CalendarEvent) => {
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
        await updateEvenementToDb(
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
      const start = dateResetOffset(values.start).toISOString();
      const end = dateResetOffset(values.end).toISOString();
      console.log({ start, end });
      await addCalendarEvent({ ...values });
    }
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteCalendarEvent();
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[50vw] sm:max-h-[95vh] overflow-auto ">
        <DialogHeader>
          <DialogTitle>
            {updateEvent ? "Modifier l'évènement" : "Ajouter un évènement"}
          </DialogTitle>
        </DialogHeader>
        <AddEventForm
          updateEvent={updateEvent}
          dates={dates}
          setDates={setDates}
          handleAddUpdateEvent={handleAddUpdateEvent}
          handleDelete={handleDelete}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
