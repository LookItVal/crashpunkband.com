import HandDrawnFrame from "./HandDrawnFrame";
import SocialMediaLinks from "./SocialMediaLinks";

export default function LandingFooter() {
  return (
    <footer className="px-4 py-8">
      <HandDrawnFrame className="mx-auto max-w-5xl" contentClassName="px-6 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em]">CRASH</p>
          <SocialMediaLinks compact />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            &copy; 2024 CRASH. All rights reserved.
          </p>
        </div>
      </HandDrawnFrame>
    </footer>
  );
}