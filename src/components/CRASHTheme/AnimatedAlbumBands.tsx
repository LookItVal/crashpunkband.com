type AnimatedAlbumBandsProps = {
  topImageSrc?: string;
  bottomImageSrc?: string;
  topHeightClassName?: string;
  bottomHeightClassName?: string;
  topDurationSeconds?: number;
  bottomDurationSeconds?: number;
};

export default function AnimatedAlbumBands({
  topImageSrc = "/AlbumBGTop.webp",
  bottomImageSrc = "/AlbumBGBottom.webp",
  topHeightClassName = "h-[50%]",
  bottomHeightClassName = "h-[80%]",
  topDurationSeconds = 300,
  bottomDurationSeconds = 180,
}: AnimatedAlbumBandsProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`albumBand albumBandBottom pointer-events-none absolute inset-x-0 bottom-0 ${bottomHeightClassName}`}
      >
        <div
          className="albumBandTrack"
          style={{
            backgroundImage: `url("${bottomImageSrc}")`,
            animationDuration: `${bottomDurationSeconds}s`,
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className={`albumBand albumBandTop pointer-events-none absolute inset-x-0 top-0 ${topHeightClassName}`}
      >
        <div
          className="albumBandTrack"
          style={{
            backgroundImage: `url("${topImageSrc}")`,
            animationDuration: `${topDurationSeconds}s`,
          }}
        />
      </div>
    </>
  );
}