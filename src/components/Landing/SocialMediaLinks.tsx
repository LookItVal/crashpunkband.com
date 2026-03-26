import GsapIntro from "./GsapIntro";
import HandDrawnFrame from "./HandDrawnFrame";
import HighlightButton from "./HighlightButton";
import HandwrittenText from "../CRASHTheme/HandwrittenText/HandwrittenText";

type SocialPlatform = "instagram" | "tiktok" | "youtube" | "spotify" | "applemusic" | "facebook";

type SocialLink = {
  name: string;
  href: string;
  platform: SocialPlatform;
};

const socialLinks: SocialLink[] = [
  { name: "Instagram", href: "https://instagram.com", platform: "instagram" },
  { name: "TikTok", href: "https://www.tiktok.com", platform: "tiktok" },
  { name: "YouTube", href: "https://www.youtube.com", platform: "youtube" },
  { name: "Spotify", href: "https://open.spotify.com", platform: "spotify" },
  { name: "Apple Music", href: "https://music.apple.com", platform: "applemusic" },
  { name: "Facebook", href: "https://facebook.com", platform: "facebook" },
];

function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const common = "h-4 w-4";
  const classes = className ?? common;

  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" fill="currentColor">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.88 2.25a1.12 1.12 0 1 1-2.25 0 1.12 1.12 0 0 1 2.25 0ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" fill="currentColor">
          <path d="M14.75 3h2.1a4.6 4.6 0 0 0 4.15 4.13v2.2a6.82 6.82 0 0 1-3.95-1.23v6.8A6.9 6.9 0 1 1 10.15 8v2.3a4.6 4.6 0 1 0 4.6 4.6V3Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" fill="currentColor">
          <path d="M22 12c0 2.5-.27 4.33-.46 5.16a3.1 3.1 0 0 1-2.18 2.18C18.53 19.53 16.7 19.8 12 19.8s-6.53-.27-7.36-.46a3.1 3.1 0 0 1-2.18-2.18C2.27 16.33 2 14.5 2 12s.27-4.33.46-5.16a3.1 3.1 0 0 1 2.18-2.18C5.47 4.47 7.3 4.2 12 4.2s6.53.27 7.36.46a3.1 3.1 0 0 1 2.18 2.18C21.73 7.67 22 9.5 22 12Zm-12.5-3.25v6.5L15.5 12l-6-3.25Z" />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.67 14.45a.8.8 0 0 1-1.1.27c-3-1.83-6.77-2.25-11.2-1.27a.8.8 0 1 1-.34-1.56c4.86-1.07 9.03-.59 12.36 1.44.37.22.49.72.28 1.12Zm1.57-3.2a1 1 0 0 1-1.36.34c-3.43-2.1-8.65-2.7-12.72-1.45a1 1 0 0 1-.59-1.9c4.64-1.44 10.4-.76 14.35 1.66.47.29.63.9.32 1.35Zm.13-3.33c-4.12-2.44-10.9-2.67-14.84-1.45a1.2 1.2 0 0 1-.72-2.3c4.53-1.4 12.06-1.13 16.77 1.66a1.2 1.2 0 1 1-1.21 2.09Z" />
        </svg>
      );
    case "applemusic":
      return (
        <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" fill="currentColor">
          <path d="M18 4.5v9.9a3.1 3.1 0 1 1-1.5-2.67V7.1l-7 1.35v8.95a3.1 3.1 0 1 1-1.5-2.67V7.2c0-.71.5-1.32 1.2-1.45L18 4.5Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" fill="currentColor">
          <path d="M13.5 22v-8h2.69l.4-3h-3.09V9.08c0-.87.25-1.46 1.5-1.46h1.6V4.94A20.9 20.9 0 0 0 14.26 4c-2.32 0-3.91 1.4-3.91 4V11H7.7v3h2.65v8h3.15Z" />
        </svg>
      );
    default:
      return null;
  }
}

type SocialMediaLinksProps = {
  compact?: boolean;
};

export default function SocialMediaLinks({ compact = false }: SocialMediaLinksProps) {
  return (
    <GsapIntro>
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
                strokeWidth={compact ? 1.8 : 2}
                textAlign="left"
              >
                {link.name}
              </HandwrittenText>
            </HighlightButton>
          </HandDrawnFrame>
        ))}
      </div>
    </GsapIntro>
  );
}