import CountdownBannerClient from "./CountdownBannerClient";

type CountdownBannerProps = {
  targetDate: string | Date;
};

export default function CountdownBanner({ targetDate }: CountdownBannerProps) {
  return <CountdownBannerClient targetDate={targetDate} />;
}