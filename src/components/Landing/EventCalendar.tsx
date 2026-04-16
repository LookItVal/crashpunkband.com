"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

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

function formatWhenDayLabel(value: string) {
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
  });
}

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getWhenDisplayLabel(value: string) {
  if (!value) {
    return null;
  }

  const eventDate = new Date(value);

  if (Number.isNaN(eventDate.getTime())) {
    return formatWhenDayLabel(value);
  }

  const todayStart = getStartOfDay(new Date());
  const eventStart = getStartOfDay(eventDate);
  const dayDiff = Math.round((eventStart.getTime() - todayStart.getTime()) / 86400000);

  if (dayDiff < 0) {
    return null;
  }

  if (dayDiff === 0) {
    return "TONIGHT";
  }

  if (dayDiff === 1) {
    return "TOMORROW";
  }

  return formatWhenDayLabel(value);
}

function formatDoorsTimeLabel(value: string) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getLocationLinkParts(location: string) {
  const trimmed = location.trim();

  if (!trimmed) {
    return {
      label: "TBD",
      href: "",
    };
  }

  const lineBreakIndex = trimmed.indexOf("\n");
  const commaIndex = trimmed.indexOf(",");
  const delimiterIndexCandidates = [lineBreakIndex, commaIndex].filter((value) => value >= 0);
  const delimiterIndex = delimiterIndexCandidates.length > 0 ? Math.min(...delimiterIndexCandidates) : -1;

  const venueLabel = delimiterIndex === -1 ? trimmed : trimmed.slice(0, delimiterIndex).trim();
  const addressQueryRaw = delimiterIndex === -1 ? trimmed : trimmed.slice(delimiterIndex + 1).trim();
  const addressQuery = addressQueryRaw.replace(/^,+\s*/, "").trim() || trimmed;

  return {
    label: venueLabel || "Venue",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`,
  };
}

export default function EventCalendar({
  icalUrl = "https://crashcalproxy.qnncecil.workers.dev/ical",
  joinUrl = "https://calendar.google.com/calendar/u/0?cid=Nzk4YzFkNmNhNzc0YzI3ZWM2N2NmNzc4MjkwNzY4YmZkYTQ5ZjRjYjdmOTM0MDQ0NmExOGNiNzk1ZDc5NWU2NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  eventsPerPage = 6
}: EventCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFlyer, setActiveFlyer] = useState<{ url: string; alt: string } | null>(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const eventListRef = useRef<HTMLDivElement | null>(null);
  const pageTransitionTimelineRef = useRef<gsap.core.Timeline | null>(null);

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
  const upcomingEvents = useMemo(() => {
    return events.filter((event) => getWhenDisplayLabel(event.startDateTime) !== null);
  }, [events]);

  const totalPages = Math.max(1, Math.ceil(upcomingEvents.length / safeEventsPerPage));

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * safeEventsPerPage;
    return upcomingEvents.slice(start, start + safeEventsPerPage);
  }, [currentPage, upcomingEvents, safeEventsPerPage]);

  const animateToPage = (nextPage: number) => {
    if (nextPage === currentPage || isPageTransitioning) {
      return;
    }

    const container = eventListRef.current;
    if (!container) {
      setCurrentPage(nextPage);
      return;
    }

    if (pageTransitionTimelineRef.current) {
      pageTransitionTimelineRef.current.kill();
      pageTransitionTimelineRef.current = null;
    }

    setIsPageTransitioning(true);

    const rowElements = Array.from(container.querySelectorAll<HTMLElement>("[data-calendar-row]"));
    const textElements = rowElements.flatMap((row) => Array.from(row.querySelectorAll<HTMLElement>("p,span,a,button")));

    const eraseTimeline = gsap.timeline({
      onComplete: () => {
        setCurrentPage(nextPage);

        window.requestAnimationFrame(() => {
          const nextContainer = eventListRef.current;
          if (!nextContainer) {
            setIsPageTransitioning(false);
            return;
          }

          const nextRows = Array.from(nextContainer.querySelectorAll<HTMLElement>("[data-calendar-row]"));
          const nextText = nextRows.flatMap((row) => Array.from(row.querySelectorAll<HTMLElement>("p,span,a,button")));

          gsap.set(nextRows, {
            opacity: 0,
            y: 10,
            filter: "blur(4px)",
          });

          gsap.set(nextText, {
            opacity: 0,
            letterSpacing: "0.24em",
          });

          const drawTimeline = gsap.timeline({
            onComplete: () => {
              setIsPageTransitioning(false);
              pageTransitionTimelineRef.current = null;
            },
          });

          drawTimeline
            .to(nextRows, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.18,
              ease: "power2.out",
              stagger: {
                each: 0.03,
                from: "random",
              },
            })
            .to(nextText, {
              opacity: 1,
              letterSpacing: "0.12em",
              duration: 0.12,
              ease: "power1.out",
              stagger: {
                each: 0.004,
                from: "random",
              },
            }, 0.02);

          pageTransitionTimelineRef.current = drawTimeline;
        });
      },
    });

    eraseTimeline
      .to(textElements, {
        opacity: 0.05,
        letterSpacing: "0.34em",
        duration: 0.08,
        ease: "power2.in",
        stagger: {
          each: 0.004,
          from: "random",
        },
      }, 0)
      .to(rowElements, {
        opacity: 0,
        x: () => gsap.utils.random(-12, 12),
        y: () => gsap.utils.random(-6, 6),
        skewX: () => gsap.utils.random(-8, 8),
        filter: "blur(6px)",
        duration: 0.14,
        ease: "power3.in",
        stagger: {
          each: 0.03,
          from: "random",
        },
      }, 0);

    pageTransitionTimelineRef.current = eraseTimeline;
  };

  useEffect(() => {
    return () => {
      if (pageTransitionTimelineRef.current) {
        pageTransitionTimelineRef.current.kill();
        pageTransitionTimelineRef.current = null;
      }
    };
  }, []);

  return (
    <HandDrawnFrame contentClassName="p-6 md:p-8">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="md:w-32 w-25">
            <HandwrittenText as="h2" fontSize={26} mobileFontSize={20} strokeWidth={3.2} mobileStrokeWidth={2.5}>
              Event Calendar
            </HandwrittenText>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <HandDrawnFrame className="inline-block" contentClassName="px-3 py-2">
              <HighlightButton
                href={joinUrl}
                target="_blank"
                rel="noreferrer"
                textClassName="w-34"
              >
                <HandwrittenText fontSize={11} mobileFontSize={9} strokeWidth={2} textAlign="center">
                  {"Follow\u00a0Calendar"}
                </HandwrittenText>
              </HighlightButton>
            </HandDrawnFrame>
          </div>
        </div>

        {isLoading ? (
          <HandDrawnFrame className="min-h-56" contentClassName="flex min-h-56 items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
              <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
                Loading calendar...
              </HandwrittenText>
            </div>
          </HandDrawnFrame>
        ) : errorMessage ? (
          <HandDrawnFrame className="min-h-56" contentClassName="flex min-h-56 items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
              <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
                {errorMessage}
              </HandwrittenText>
            </div>
          </HandDrawnFrame>
        ) : upcomingEvents.length === 0 ? (
          <HandDrawnFrame className="min-h-56" contentClassName="flex min-h-56 items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
              <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
                No upcoming events.
              </HandwrittenText>
            </div>
          </HandDrawnFrame>
        ) : (
          <div className="space-y-6">
            <div ref={eventListRef} className="space-y-3">
              {paginatedEvents.map((event) => (
                <HandDrawnFrame key={event.id} contentClassName="px-4 py-3">
                  <article data-calendar-row className="flex md:flex-row flex-col items-center justify-between gap-x-10 gap-y-2 text-center">
                    <div className="min-w-[15em]">
                      <HandwrittenText fontSize={14} mobileFontSize={10} strokeColor="#f4f4f5" strokeWidth={2.3} textAlign="center">
                        {event.showName || "Show name"}
                      </HandwrittenText>
                    </div>
                    
                    <div className="flex items-center justify-between md:gap-x-6 gap-x-3 gap-y-2 flex-wrap grow">
                      <div className="flex flex-col items-center align-center justify-center grow">
                        <HandwrittenText fontSize={8} mobileFontSize={7} strokeColor="#71717a" strokeWidth={1.6} textAlign="center">
                          When:
                        </HandwrittenText>
                        <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
                          {getWhenDisplayLabel(event.startDateTime) || "TBD"}
                        </HandwrittenText>
                      </div>

                      {(() => {
                        const locationLink = getLocationLinkParts(event.location);

                        return (
                          <div className="flex flex-col items-center align-center justify-center grow">
                            <HandwrittenText fontSize={8} mobileFontSize={7} strokeColor="#71717a" strokeWidth={1.6} textAlign="center">
                              Where:
                            </HandwrittenText>
                            {locationLink.href ? (
                              <HighlightButton
                                href={locationLink.href}
                                target="_blank"
                                rel="noreferrer"
                                textClassName="w-full"
                              >
                                <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#e4e4e7" strokeWidth={2} textAlign="center">
                                  {locationLink.label}
                                </HandwrittenText>
                              </HighlightButton>
                            ) : (
                              <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
                                {locationLink.label}
                              </HandwrittenText>
                            )}
                          </div>
                        );
                      })()}

                      <div className="flex flex-col items-center align-center justify-center grow">
                        <HandwrittenText fontSize={8} mobileFontSize={7} strokeColor="#71717a" strokeWidth={1.6} textAlign="center">
                          Doors:
                        </HandwrittenText>
                        <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#d4d4d8" strokeWidth={2} textAlign="center">
                          {formatDoorsTimeLabel(event.doorsDateTime)}
                        </HandwrittenText>
                      </div>

                      {event.flyerImageUrl ? (
                        <HighlightButton
                          className="grow"
                          textClassName="w-full text-center block!"
                          onClick={() => setActiveFlyer({ url: event.flyerImageUrl, alt: `${event.showName} flyer` })}
                        >
                          <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#e4e4e7" strokeWidth={2} textAlign="center">
                            View Flyer
                          </HandwrittenText>
                        </HighlightButton>
                      ) : (
                        <span className="grow text-center block!">
                          <HandwrittenText fontSize={11} mobileFontSize={9} strokeColor="#71717a" strokeWidth={2} textAlign="center">
                            No Flyer
                          </HandwrittenText>
                        </span>
                      )}
                    </div>
                  </article>
                </HandDrawnFrame>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="max-w-[16rem]">
                <HandwrittenText fontSize={10} mobileFontSize={9} strokeColor="#a1a1aa" strokeWidth={1.8}>
                  {`Page ${currentPage} of ${totalPages}`}
                </HandwrittenText>
              </div>

              <div className="flex items-center gap-2">
                <HandDrawnFrame className="inline-block" contentClassName="px-3 py-2">
                  <HighlightButton
                    disabled={currentPage <= 1 || isPageTransitioning}
                    onClick={() => animateToPage(Math.max(1, currentPage - 1))}
                    textClassName="w-full"
                  >
                    <HandwrittenText fontSize={10} mobileFontSize={9} strokeWidth={1.9} textAlign="center">
                      Previous
                    </HandwrittenText>
                  </HighlightButton>
                </HandDrawnFrame>
                <HandDrawnFrame className="inline-block" contentClassName="px-3 py-2">
                  <HighlightButton
                    disabled={currentPage >= totalPages || isPageTransitioning}
                    onClick={() => animateToPage(Math.min(totalPages, currentPage + 1))}
                    textClassName="w-full"
                  >
                    <HandwrittenText fontSize={10} mobileFontSize={9} strokeWidth={1.9} textAlign="center">
                      Next
                    </HandwrittenText>
                  </HighlightButton>
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
            className="absolute right-4 top-4"
            onClick={() => setActiveFlyer(null)}
          >
            <HandwrittenText fontSize={14} mobileFontSize={12} strokeWidth={2.2}>
              Close
            </HandwrittenText>
          </button>
          <div className="relative flex h-[82vh] w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img src={activeFlyer.url} alt={activeFlyer.alt} className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      ) : null}
    </HandDrawnFrame>
  );
}