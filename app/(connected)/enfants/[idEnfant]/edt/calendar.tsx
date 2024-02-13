"use client";
import {
  addEvenementToDb,
  deleteEvenementToDb,
  updateEvenementToDb,
} from "@/components/actions/edt";
import { AddEventModal } from "@/components/edt/addEventModal";
import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/components/zodSchemas/event";
import {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list'
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Categorie } from "@prisma/client";
import { useState } from "react";
import { CategorieUsedEvent } from "./categoryUsedEvent";

function Calendar({
  idEnfant,
  calendarEvents: calendarEventsInitial,
  categories,
}: {
  idEnfant: number;
  calendarEvents: EventInput & { backgroundColor?: string & CategorieUsedEvent };
  categories: Categorie[];
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

  const resetUpdate = () => setUpdateEvent(null);

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

  const handleEventChange = async (
    event: EventChangeArg,
    idCategorie: null | number = null
  ) => {
    const dates = event.event.start &&
      event.event.end && { start: event.event.start, end: event.event.end };
    const id = Number(event.event._def.publicId);
    const titre = event.event._def.title;
    const description = event.event._def.extendedProps.description || null;
    if (dates && id) {
      try {
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
      } catch (error) {
        console.error(error);
      }
    }
  };

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
          titre: event.title,
          idEnfant: idEnfant,
          description: event.description || null,
          idCategorie: event.idCategorie || null,
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
  return (
    <div>
      <Fullcalendar
        // timeZone="Paris/Europe"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // will normally be on the right. if RTL, will be on the left
        }}
        height={"90vh"}
        selectable={true}
        select={handleSelect} // triggered when a date/time selection is made;
        events={calendarEventsInitial}
        eventClick={handleEventClick}
        locale={frLocale}
        editable={true}
        eventChange={handleEventChange}
        themeSystem="shadcn"
      />
      <AddEventModal
        open={showModal}
        setOpen={setShowModal}
        addCalendarEvent={addCalendarEvent}
        useUpdateEvent={{
          updateEvent: calendarState.updateEvent,
          resetUpdate: resetUpdate,
        }}
        useDates={{ dates: calendarState.currDate, setDates: setCurrDate }}
        deleteCalendarEvent={deleteCalendarEvent}
        updateEvenementToDb={updateEvenementToDb}
        categories={categories}
        categorie={calendarState.updateEvent?.extendedProps.categorie || null}
      />
    </div>
  );
}

export default Calendar;
