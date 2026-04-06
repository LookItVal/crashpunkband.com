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
    code: "cutloose321",
    title: "Cut Loose",
    audioFile: "/audio/Cut Loose.mp3",
  },
  {
    code: "gottahaveit456",
    title: "Gotta Have It",
    audioFile: "/audio/Gotta Have It.wav",
  },
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
