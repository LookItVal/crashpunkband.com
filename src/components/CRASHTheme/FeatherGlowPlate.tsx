import type { CSSProperties, ReactNode } from "react";

type FeatherGlowPlateProps = {
  children: ReactNode;
  className?: string;
  inset?: string;
  radius?: string;
  blur?: string;
  padding?: string;
};

export default function FeatherGlowPlate({
  children,
  className = "",
  inset = "-1.1rem -1.4rem",
  radius = "2.5rem",
  blur = "12px",
  padding,
}: FeatherGlowPlateProps) {
  const style = {
    ["--plate-inset" as string]: inset,
    ["--plate-radius" as string]: radius,
    ["--plate-blur" as string]: blur,
    ...(padding ? { padding } : {}),
  } as CSSProperties;

  return (
    <div className={`featherGlowPlate ${className}`.trim()} style={style}>
      <div className="relative w-full h-full">{children}</div>

      <style jsx>{`
        .featherGlowPlate {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2rem;
          isolation: isolate;
        }

        .featherGlowPlate::before {
          content: "";
          position: absolute;
          inset: var(--plate-inset);
          border-radius: var(--plate-radius);
          background:
            radial-gradient(circle at center, rgba(0, 0, 0, 0.74) 0%, rgba(0, 0, 0, 0.56) 38%, rgba(0, 0, 0, 0.28) 62%, rgba(0, 0, 0, 0.1) 78%, rgba(0, 0, 0, 0) 100%);
          filter: blur(var(--plate-blur));
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}