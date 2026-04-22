/**
 * Configuration for hidden ARG song pages
 * Change the codes to update the URLs for each song
 * Codes should be semi-random but can contain hidden messages
 */

export type SongConfig = {
  code: string;
  title: string;
  audioFile: string;
};

export const SONGS: SongConfig[] = [
  {
    code: "cut-loose",
    title: "Cut Loose",
    audioFile: "/audio/CUT LOOSE.mp3",
  },
  {
    code: "throw-me-away",
    title: "Throw Me Away",
    audioFile: "/audio/THROW ME AWAY.mp3",
  }
];

/**
 * Get song by code
 */
export function getSongByCode(code: string): SongConfig | undefined {
  return SONGS.find((song) => song.code === code);
}

/**
 * Get all valid song codes
 */
export function getAllSongCodes(): string[] {
  return SONGS.map((song) => song.code);
}
