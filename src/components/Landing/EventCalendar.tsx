"use client";

import { useEffect, useMemo, useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";

type CalendarEvent = {
  id: string;
  showName: string;
  startDateTime: string;
  doorsDateTime: string;
  location: string;
  flyerImageUrl: string;
};

type EventCalendarProps = {
  icalUrl?: string;
  joinUrl?: string;
  eventsPerPage?: number;
};

function unfoldIcalContent(icalPlainText: string) {
  return icalPlainText.replace(/\r?\n[ \t]/g, "");
}

function parseIcalDateTime(value: string) {
  const clean = value.trim();

  if (!clean) {
    return "";
  }

  const basicUtc = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (basicUtc) {
    const [, year, month, day, hour, minute, second] = basicUtc;
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }

  const basicLocal = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
  if (basicLocal) {
    const [, year, month, day, hour, minute, second] = basicLocal;
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  const allDay = clean.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (allDay) {
    const [, year, month, day] = allDay;
    return `${year}-${month}-${day}`;
  }

  return clean;
}

function decodeIcalText(value: string) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .trim();
}

function getFieldValue(block: string, fieldName: string) {
  const fieldPattern = new RegExp(`^${fieldName}(?:;[^:]*)?:(.*)$`, "im");
  const match = block.match(fieldPattern);
  return match?.[1]?.trim() ?? "";
}

function extractGoogleDriveFileId(url: string) {
  const raw = url.trim();

  if (!raw) {
    return "";
  }

  const idFromQuery = raw.match(/[?&]id=([^&]+)/i)?.[1];
  if (idFromQuery) {
    return decodeURIComponent(idFromQuery);
  }

  const idFromPath = raw.match(/\/file\/d\/([^/]+)/i)?.[1] ?? raw.match(/\/d\/([^/]+)/i)?.[1];
  if (idFromPath) {
    return decodeURIComponent(idFromPath);
  }

  return "";
}

function normalizeGoogleDriveImageUrl(url: string, imageProxyBaseUrl: string) {
  const fileId = extractGoogleDriveFileId(url);

  if (!fileId) {
    return "";
  }

  return `${imageProxyBaseUrl}/image?id=${encodeURIComponent(fileId)}`;
}

function parseIcalEvents(icalPlainText: string, imageProxyBaseUrl: string): CalendarEvent[] {
  const unfolded = unfoldIcalContent(icalPlainText);
  const blocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gim) ?? [];

  return blocks
    .map((block, index) => {
      const uid = getFieldValue(block, "UID");
      const summary = decodeIcalText(getFieldValue(block, "SUMMARY"));
      const location = decodeIcalText(getFieldValue(block, "LOCATION"));
      const dtStart = parseIcalDateTime(getFieldValue(block, "DTSTART"));
      const attachRaw = getFieldValue(block, "ATTACH");
      const flyerImageUrl = normalizeGoogleDriveImageUrl(decodeIcalText(attachRaw), imageProxyBaseUrl);

      return {
        id: uid || `${summary || "event"}-${index}`,
        showName: summary || "Untitled Show",
        startDateTime: dtStart,
        doorsDateTime: dtStart,
        location,
        flyerImageUrl,
      };
    })
    .sort((first, second) => {
      const firstTime = first.startDateTime ? new Date(first.startDateTime).getTime() : Number.MAX_SAFE_INTEGER;
      const secondTime = second.startDateTime ? new Date(second.startDateTime).getTime() : Number.MAX_SAFE_INTEGER;

      return firstTime - secondTime;
    });
}

function formatDateLabel(value: string) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventCalendar({
  icalUrl = "https://crashcalproxy.qnncecil.workers.dev",
  joinUrl = "https://calendar.google.com/calendar/u/0?cid=Nzk4YzFkNmNhNzc0YzI3ZWM2N2NmNzc4MjkwNzY4YmZkYTQ5ZjRjYjdmOTM0MDQ0NmExOGNiNzk1ZDc5NWU2NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  eventsPerPage = 6
}: EventCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFlyer, setActiveFlyer] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadCalendar = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const abortController = new AbortController();
      const timeoutId = window.setTimeout(() => {
        abortController.abort();
      }, 12000);

      try {
        const requestUrl = new URL(icalUrl, window.location.origin);
        requestUrl.searchParams.set("_t", String(Date.now()));
        const imageProxyBaseUrl = requestUrl.origin;

        const response = await fetch(requestUrl.toString(), {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load calendar: ${response.status}`);
        }

        const icalPlainText = await response.text();
  const parsedEvents = parseIcalEvents(icalPlainText, imageProxyBaseUrl);

        if (parsedEvents.length === 0) {
          throw new Error("Calendar loaded but no VEVENT entries were parsed.");
        }

        if (!isActive) {
          return;
        }

        setEvents(parsedEvents);
        setCurrentPage(1);
      } catch (error) {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error
            ? error.name === "AbortError"
              ? "Calendar request timed out."
              : error.message
            : "Unknown calendar error.";

        setErrorMessage(message);
        setEvents([]);
      } finally {
        window.clearTimeout(timeoutId);

        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadCalendar();

    return () => {
      isActive = false;
    };
  }, [icalUrl]);

  const safeEventsPerPage = Math.max(1, eventsPerPage);
  const totalPages = Math.max(1, Math.ceil(events.length / safeEventsPerPage));

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * safeEventsPerPage;
    return events.slice(start, start + safeEventsPerPage);
  }, [currentPage, events, safeEventsPerPage]);

  return (
    <HandDrawnFrame contentClassName="p-6 md:p-8">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Event Calendar</h2>
          <div className="flex flex-wrap items-center gap-2">
            <HandDrawnFrame className="inline-block" contentClassName="px-3 py-2">
              <HighlightButton
                href={joinUrl}
                target="_blank"
                rel="noreferrer"
                textClassName="text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs"
              >
                Follow Calendar
                </HighlightButton>
            </HandDrawnFrame>
          </div>
        </div>

        {isLoading ? (
          <HandDrawnFrame className="min-h-56" contentClassName="flex min-h-56 items-center justify-center px-6 py-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">Loading calendar...</p>
          </HandDrawnFrame>
        ) : errorMessage ? (
          <HandDrawnFrame className="min-h-56" contentClassName="flex min-h-56 items-center justify-center px-6 py-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">{errorMessage}</p>
          </HandDrawnFrame>
        ) : events.length === 0 ? (
          <HandDrawnFrame className="min-h-56" contentClassName="flex min-h-56 items-center justify-center px-6 py-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
              No events yet. Add parser logic to map the iCal feed fields.
            </p>
          </HandDrawnFrame>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {paginatedEvents.map((event) => (
                <HandDrawnFrame key={event.id} contentClassName="p-4">
                  <article className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] text-zinc-100">{event.showName || "Show name"}</h3>
                    </div>

                    <div className="grid gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-300">
                      <p>
                        <span className="text-zinc-500">When: </span>
                        {formatDateLabel(event.startDateTime)}
                      </p>
                      <p>
                        <span className="text-zinc-500">Doors: </span>
                        {formatDateLabel(event.doorsDateTime)}
                      </p>
                      <p>
                        <span className="text-zinc-500">Location: </span>
                        {event.location || "TBD"}
                      </p>
                    </div>

                    <HandDrawnFrame contentClassName="p-2">
                      {event.flyerImageUrl ? (
                        <div className="flex h-16 items-center justify-center text-center">
                          <HighlightButton
                            className="w-full justify-center"
                            textClassName="text-[10px] font-bold uppercase tracking-[0.15em]"
                            onClick={() => setActiveFlyer({ url: event.flyerImageUrl, alt: `${event.showName} flyer` })}
                          >
                            View Flyer
                          </HighlightButton>
                        </div>
                      ) : (
                        <div className="flex h-16 items-center justify-center text-center text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                          Flyer image url placeholder
                        </div>
                      )}
                    </HandDrawnFrame>
                  </article>
                </HandDrawnFrame>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <HandDrawnFrame className="inline-block" contentClassName="px-3 py-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                    className="text-[10px] font-bold uppercase tracking-[0.16em] disabled:opacity-40"
                  >
                    Previous
                  </button>
                </HandDrawnFrame>
                <HandDrawnFrame className="inline-block" contentClassName="px-3 py-2">
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                    className="text-[10px] font-bold uppercase tracking-[0.16em] disabled:opacity-40"
                  >
                    Next
                  </button>
                </HandDrawnFrame>
              </div>
            </div>
          </div>
        )}
      </section>

      {activeFlyer ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveFlyer(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded event flyer"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-sm font-black uppercase tracking-[0.2em] text-white"
            onClick={() => setActiveFlyer(null)}
          >
            Close
          </button>
          <div className="relative flex h-[82vh] w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img src={activeFlyer.url} alt={activeFlyer.alt} className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      ) : null}
    </HandDrawnFrame>
  );
}