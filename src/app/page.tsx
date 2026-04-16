import type { Metadata } from "next";
import CountdownBanner from "../components/Landing/CountdownBanner";
import BandMembersSection from "../components/Landing/BandMembersSection";
import EventCalendar from "../components/Landing/EventCalendar";
import LandingFooter from "../components/Landing/LandingFooter";
import MediaGallery from "../components/Landing/MediaGallery";
import PunkFlierHero from "../components/Landing/PunkFlierHero";

export const metadata: Metadata = {
  title: "CRASH",
  description: "Official website for the punk rock band CRASH, based in Kansas City. Discover our music, tour dates, and more.",
};

export default function Home() {
  const releaseDate = "2026-04-30T00:00:00";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-8 md:px-10 md:py-10">
        {/* <CountdownBanner targetDate={releaseDate} /> */}
        <PunkFlierHero />
        <BandMembersSection />
        <MediaGallery />
        <EventCalendar />
        <LandingFooter />
      </div>
    </main>
  );
}