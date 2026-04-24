import EventCalendarClient from "./EventCalendarClient";

type EventCalendarProps = {
  icalUrl?: string;
  joinUrl?: string;
  eventsPerPage?: number;
};

export default function EventCalendar({
  icalUrl = "https://crashcalproxy.qnncecil.workers.dev/ical",
  joinUrl = "https://calendar.google.com/calendar/u/0?cid=Nzk4YzFkNmNhNzc0YzI3ZWM2N2NmNzc4MjkwNzY4YmZkYTQ5ZjRjYjdmOTM0MDQ0NmExOGNiNzk1ZDc5NWU2NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  eventsPerPage = 6
}: EventCalendarProps) {
  return <EventCalendarClient icalUrl={icalUrl} joinUrl={joinUrl} eventsPerPage={eventsPerPage} />;
}