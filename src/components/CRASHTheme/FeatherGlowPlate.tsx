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
    </div>
  );
}