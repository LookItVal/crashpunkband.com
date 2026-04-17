import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";
import { SiBandcamp, SiFacebook, SiInstagram, SiSoundcloud, SiYoutube } from "react-icons/si";

type SocialPlatform = "instagram" | "facebook" | "youtube" | "bandcamp" | "soundcloud";

type SocialLink = {
  name: string;
  href: string;
  platform: SocialPlatform;
};

const socialLinks: SocialLink[] = [
  { name: "Instagram", href: "https://www.instagram.com/crash.punk.band", platform: "instagram" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61578805764907", platform: "facebook" },
  { name: "Youtube", href: "https://www.youtube.com/@crashpunkband", platform: "youtube" },
  { name: "Bandcamp", href: "https://crashpunkband.bandcamp.com/", platform: "bandcamp" },
  { name: "SoundCloud", href: "https://www.soundcloud.com/crash-622251981", platform: "soundcloud" }
];

function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const common = "h-4 w-4";
  const classes = className ?? common;

  switch (platform) {
    case "instagram":
      return <SiInstagram className={classes} aria-hidden="true" />;
    case "youtube":
      return <SiYoutube className={classes} aria-hidden="true" />;
    case "facebook":
      return <SiFacebook className={classes} aria-hidden="true" />;
    case "bandcamp":
      return <SiBandcamp className={classes} aria-hidden="true" />;
    case "soundcloud":
      return <SiSoundcloud className={classes} aria-hidden="true" />;
    default:
      return null;
  }
}

type SocialMediaLinksProps = {
  compact?: boolean;
};

export default function SocialMediaLinks({ compact = false }: SocialMediaLinksProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {socialLinks.map((link) => (
        <HandDrawnFrame
          key={link.name}
          className="inline-block"
          contentClassName={compact ? "px-3 py-2" : "px-4 py-3"}
        >
          <HighlightButton
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="w-full"
            textClassName="w-full"
          >
            <SocialIcon platform={link.platform} className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <HandwrittenText
              className="w-auto"
              fontSize={compact ? 10 : 11}
              mobileFontSize={compact ? 9 : 10}
              strokeWidth={compact ? 1.4 : 1.5}
              textAlign="left"
            >
              {link.name}
            </HandwrittenText>
          </HighlightButton>
        </HandDrawnFrame>
      ))}
    </div>
  );
}