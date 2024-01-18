"use client";
import {
  addEvenementToDb,
  deleteEvenementToDb,
  updateEvenementToDb,
} from "@/components/actions/edt";
import { Button } from "@/components/ui/button";
import { AddEventModal } from "@/components/ui/edt/addEventModal";
import { useToast } from "@/components/ui/use-toast";
import eventSchema, { CalendarEvent } from "@/components/zodSchemas/event";
import {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { revalidatePath } from "next/cache";
import { useState } from "react";

function Calendar({
  idEnfant,
  calendarEvents: calendarEventsInitial,
}: {
  idEnfant: number;
  calendarEvents: EventInput;
}) {
  const [calendarState, setCalendarState] = useState<{
    showModal: boolean;
    calendarEvents: EventInput;
    currDate: { start: Date; end?: Date };
    updateEvent: EventImpl | null;
  }>({
    showModal: false,
    calendarEvents: calendarEventsInitial,
    currDate: { start: new Date() },
    updateEvent: null,
  });
  const { showModal, updateEvent } = calendarState;
  const { toast } = useToast();

  /**
   * Adds a new event to the calendar state.
   * @param {CalendarEvent} event - The event to be added.
   */
  const addCalendarEvent = async (event: CalendarEvent) => {
    try {
      const addedEvent = await addEvenementToDb(
        {
          dateDebut: event.start,
          dateFin: event.end,
          description: event.description || null,
          titre: event.title,
          idEnfant: idEnfant,
        },
        "/(connected)/enfants/[idEnfant]/edt/"
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'évènement.",
        variant: "destructive",
      });
    }
  };

  /**
   * Sets the visibility of the modal.
   * @param {boolean} show - The visibility state to be set.
   */
  const setShowModal = (show: boolean) => {
    setCalendarState((curr) => ({
      ...curr,
      showModal: show,
    }));
  };

  /**
   * Updates an event in the calendar state.
   * @param {EventImpl | null} event - The event to be updated.
   */
  const setUpdateEvent = (event: EventImpl | null) => {
    setCalendarState((curr) => ({ ...curr, updateEvent: event }));
  };

  /**
   * Updates a calendar event.
   * @param event The event to update.
   * @returns A promise that resolves when the event is updated.
   */
  const updateCalendarEvent = async (event: EventImpl) => {
    // setCalendarState((curr) => ({ ...curr, updateEvent: event }));
    const evenementUpdateAbled = {
      dateDebut: event.start,
      dateFin: event.end,
      description: event.extendedProps.description || null,
      titre: event.title || "",
      idEnfant: idEnfant,
      id: Number(event.id) || null,
    };
    const eventParsed = eventSchema.safeParse(evenementUpdateAbled);
    if (eventParsed.success) {
      const {
        end: dateFin,
        start: dateDebut,
        title: titre,
        description,
      } = eventParsed.data;
      const id = Number(evenementUpdateAbled.id);
      if (!(isNaN(id) || id === null)) {
        await updateEvenementToDb(
          { id, dateFin, dateDebut, titre, description: description || null },
          "/(connected)/enfants/[idEnfant]/edt/"
        );
      } else {
        // no coherent id
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la mise à jour de l'évènement : \n" +
            "Aucun id n'a été trouvé pour l'évènement",
          variant: "destructive",
        });
        return;
      }
    } else {
      // zod error
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour de l'évènement : \n" +
          eventParsed.error.issues.map((el) => el.message).join("\n"),
        variant: "destructive",
      });
    }
  };

  const deleteCalendarEvent = async () => {
    try {
      const id = Number(updateEvent?._def.publicId);
      if (id) {
        deleteEvenementToDb({ id }, "/(connected)/enfants/[idEnfant]/edt/");
      } else {
        toast({
          title: "Erreur",
          description: "Il manque l'id de l'évènement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setUpdateEvent(null);
    }
  };

  /**
   * Sets the current date in the calendar state.
   * @param {{ start: Date; end?: Date }} date - The date to be set.
   */
  const setCurrDate = (date: { start: Date; end?: Date }) => {
    setCalendarState((curr) => ({
      ...curr,
      currDate: date,
    }));
  };

  /**
   * Handles the click event on an event.
   * @param {EventClickArg} event - The event object containing the clicked event.
   */
  const handleEventClick = ({ event }: EventClickArg) => {
    setUpdateEvent(event);
    if (event.start) {
      setCurrDate({ start: event.start, end: event.end || undefined });
      setShowModal(true);
    } else {
      toast({
        title: "Erreur",
        description: "L'évènement n'a pas de dates.",
      });
    }
  };

  /**
   * Handles the selection of a date range.
   * @param {DateSelectArg} args - The object containing the start and end dates of the selection.
   */
  const handleSelect = (args: DateSelectArg) => {
    setCurrDate({ start: args.start, end: args.end });
    setShowModal(true);
  };

  const handleEventChange = async (event: EventChangeArg) => {
    const dates = event.event.start &&
      event.event.end && { start: event.event.start, end: event.event.end };
    const id = Number(event.event._def.publicId);
    const titre = event.event._def.title;
    const description = event.event._def.extendedProps.description || null;
    if (dates && id) {
      await updateEvenementToDb(
        {
          id,
          dateDebut: dates.start,
          dateFin: dates.end,
          description,
          titre,
        },
        "/(connected)/enfants/[idEnfant]/edt/"
      );
    }
  };

  return (
    <div>
      <Button onClick={() => console.log(calendarEventsInitial)}>
        clique moi
      </Button>
      <Fullcalendar
        timeZone="Paris/Europe"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
        height={"90vh"}
        selectable={true}
        select={handleSelect} // triggered when a date/time selection is made;
        events={calendarEventsInitial}
        eventClick={handleEventClick}
        locale={frLocale}
        editable={true}
        eventChange={handleEventChange}
      />
      <AddEventModal
        open={showModal}
        setOpen={setShowModal}
        addCalendarEvent={addCalendarEvent}
        useUpdateEvent={{
          updateEvent: calendarState.updateEvent,
          setUpdate: updateCalendarEvent,
        }}
        useDates={{ dates: calendarState.currDate, setDates: setCurrDate }}
        deleteCalendarEvent={deleteCalendarEvent}
        updateEvenementToDb={updateEvenementToDb}
      />
    </div>
  );
}

export default Calendar;
