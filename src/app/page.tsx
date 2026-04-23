import type { Metadata } from "next";
import CountdownBanner from "../components/Landing/CountdownBanner";
import BandMembersSection from "../components/Landing/BandMembersSection";
import EventCalendar from "../components/Landing/EventCalendar";
import LandingFooter from "../components/Landing/LandingFooter";
import MediaGallery from "../components/Landing/MediaGallery";
import PunkFlierHero from "../components/Landing/PunkFlierHero";
import { socialLinks } from "../components/Landing/SocialMediaLinks";

export const metadata: Metadata = {
  title: "CRASH",
  description: "Official website for the punk rock band CRASH, based in Kansas City. Discover our music, tour dates, and more.",
};

export default function Home() {
  const releaseDate = "2026-05-01T00:00:00";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "CRASH",
    description: "Hardcore punk rock band from Kansas City, Missouri.",
    genre: ["Hardcore Punk", "Punk Rock"],
    location: {
      "@type": "Place",
      name: "Kansas City, MO",
    },
    member: [
      {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          name: "Knoxx",
        },
        roleName: "Lead",
      },
      {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          name: "Cash",
        },
        roleName: "Guitar",
      },
      {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          name: "Fish",
        },
        roleName: "Drums",
      },
    ],
    url: "https://crashpunkband.com",
    sameAs: socialLinks.map((link) => link.href),
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-8 md:px-10 md:py-10">
        <CountdownBanner targetDate={releaseDate} />
        <PunkFlierHero />
        <BandMembersSection />
        <MediaGallery />
        <EventCalendar />
        <LandingFooter />
      </div>
    </main>
  );
}