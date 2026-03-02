import GsapIntro from "./GsapIntro";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";

const services = [
  { name: "Spotify", href: "https://open.spotify.com" },
  { name: "Apple Music", href: "https://music.apple.com" },
  { name: "YouTube Music", href: "https://music.youtube.com" },
  { name: "Amazon Music", href: "https://music.amazon.com" },
  { name: "TIDAL", href: "https://tidal.com" },
  { name: "Deezer", href: "https://www.deezer.com" },
  { name: "SoundCloud", href: "https://soundcloud.com" },
  { name: "Bandcamp", href: "https://bandcamp.com" },
];

export default function StreamingLinks() {
  return (
    <GsapIntro>
      <div id="listen" className="flex flex-wrap items-center justify-center gap-2">
        {services.map((service) => (
          <HandDrawnFrame key={service.name} className="inline-block" contentClassName="px-3 py-2">
            <HighlightButton
              href={service.href}
              target="_blank"
              rel="noreferrer"
              className="w-full"
              textClassName="text-xs font-bold uppercase tracking-[0.2em]"
            >
              {service.name}
            </HighlightButton>
          </HandDrawnFrame>
        ))}
      </div>
    </GsapIntro>
  );
}