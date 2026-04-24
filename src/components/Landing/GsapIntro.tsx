import { ReactNode } from "react";

type GsapIntroProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function GsapIntro({ children, className = "", delay = 0 }: GsapIntroProps) {
  return (
    <div
      className={["gsap-intro", className].filter(Boolean).join(" ")}
      style={{ ["--gsap-intro-delay" as string]: `${delay}s` }}
    >
      {children}
    </div>
  );
}
