"use client";
import React, { useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { AddEventModal } from "@/components/ui/edt/addEventModal";
import { EventDateType } from "@/components/types/event";
import {
  DateSelectArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { set } from "date-fns";

function Calendar() {
  // const [eventModal, setEventModal] = useState<EventDateType>();
  const [showModal, setShowModal] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
  const [currDate, setCurrDate] = useState<{start: Date, end?: Date}>({start: new Date()})

  const addCalendarEvent = (event: EventInput) => {
    setCalendarEvents((curr) => [...curr, {...event, ...currDate}]);
  };

  // const setOpenEventModal = (open: boolean) => {
  //   setCalendarEvents((curr) => ({ ...curr}));
  // };

  const handleDateClick = (event: DateClickArg) => {
    setCurrDate(curr => ({start: event.date}))
    setShowModal(true)
  };
  const handleSelect = (args: DateSelectArg) => {
    const { currentEnd, currentStart, } = args.view;
    
    setCurrDate({start: args.start, end: args.end})
    setShowModal(true)
  };
  return (
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
        height={"90vh"}
        dateClick={handleDateClick}
        selectable={true}
        select={handleSelect} // triggered when a date/time selection is made;
        events={calendarEvents}
      />
      <AddEventModal
        // date={eventModal.date}
        open={showModal}
        setOpen={setShowModal}
        addCalendarEvent={addCalendarEvent}
      />
    </div>
  );
}

export default Calendar;
