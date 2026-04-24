import { ReactNode } from "react";

type HighlightButtonProps = {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  angleRandomness?: number;
};

export default function HighlightButton({
  children,
  href,
  target,
  rel,
  onClick,
  disabled = false,
  className = "",
  textClassName = "",
  angleRandomness = 2,
}: HighlightButtonProps) {
  const tilt = Math.max(0, Math.min(angleRandomness, 2));

  const content = (
    <>
      <span className="highlight-button-fill pointer-events-none absolute inset-0 z-0 bg-white/90" />
      <span
        className={[
          "highlight-button-text relative z-10 inline-flex items-center gap-2 whitespace-nowrap text-zinc-100 transition-colors duration-200",
          textClassName,
        ].join(" ")}
      >
        {children}
      </span>
    </>
  );

  const sharedProps = {
    onClick,
    className: ["highlight-button group relative inline-flex", disabled ? "opacity-40 pointer-events-none" : "", className].join(" "),
    style: { ["--highlight-button-tilt" as string]: `${tilt}deg` },
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} {...sharedProps}>
      {content}
    </button>
  );
}