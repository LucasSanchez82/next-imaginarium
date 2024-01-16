"use client";
import { Button } from "@/components/ui/button";
import { AddEventModal } from "@/components/ui/edt/addEventModal";
import { useToast } from "@/components/ui/use-toast";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";

function Calendar() {
  const [calendarState, setCalendarState] = useState<{
    showModal: boolean;
    calendarEvents: EventInput[];
    currDate: { start: Date; end?: Date };
    updateEvent: EventImpl | null;
  }>({
    showModal: false,
    calendarEvents: [],
    currDate: { start: new Date() },
    updateEvent: null,
  });
  const { showModal, calendarEvents } = calendarState;
  const { toast } = useToast();

  /**
   * Adds a new event to the calendar state.
   * @param {EventInput} event - The event to be added.
   */
  const addCalendarEvent = (event: EventInput) => {
    setCalendarState((curr) => ({
      ...curr,
      calendarEvents: [
        ...curr.calendarEvents,
        {
          id: String(curr.calendarEvents.length + 1),
          ...event,
          ...curr.currDate,
        },
      ],
    }));
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
   * @param {EventInput} event - The event to be updated.
   */
  const setUpdateEvent = (event: EventImpl | null) => {
    setCalendarState((curr) => ({ ...curr, updateEvent: event }));
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
      setCurrDate({ start: event.start, end: event.end || undefined});
      setShowModal(true);
    } else {
      console.log
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
    console.log("handleSelect", args)
    setCurrDate({ start: args.start, end: args.end });
    setShowModal(true);
  };

  return (
    <div>
      <Button onClick={() => console.log(calendarEvents)}>
        voir les events
      </Button>
      <Fullcalendar
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
        events={calendarEvents}
        eventClick={handleEventClick}
        locale={frLocale}
        droppable={true}
        eventDrop={(event) => console.log("eventDrop", event)}
        editable={true}
      />
      <AddEventModal
        open={showModal}
        setOpen={setShowModal}
        addCalendarEvent={addCalendarEvent}
        useUpdateEvent={{
          updateEvent: calendarState.updateEvent,
          updateEventReset: () => setUpdateEvent(null),
        }}
        dates={calendarState.currDate}
      />
    </div>
  );
}

export default Calendar;
