import HandDrawnFrame from "./HandDrawnFrame";

export default function CalendarPlaceholder() {
  return (
    <HandDrawnFrame className="bg-zinc-950/70" contentClassName="p-6 md:p-8">
      <section>
        <HandDrawnFrame className="min-h-72" strokeClassName="text-white/35" contentClassName="flex min-h-72 items-center justify-center">
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            Calendar coming soon! Stay tuned for tour dates and events.
          </p>
        </HandDrawnFrame>
      </section>
    </HandDrawnFrame>
  );
}