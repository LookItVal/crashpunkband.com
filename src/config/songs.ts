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
    code: "answers",
    title: "Answers",
    audioFile: "/audio/ANSWERS.mp3",
  },
  {
    code: "decay",
    title: "Decay",
    audioFile: "/audio/DECAY.mp3",
  },
  {
    code: "fight-back",
    title: "Fight Back",
    audioFile: "/audio/FIGHT BACK.mp3",
  },
  {
    code: "fried",
    title: "Fried",
    audioFile: "/audio/FRIED.mp3",
  },
  {
    code: "give-me-fire",
    title: "Give Me Fire",
    audioFile: "/audio/GIVE ME FIRE.mp3",
  },
  {
    code: "kill-the-shill",
    title: "Kill The Shill",
    audioFile: "/audio/KILL THE SHILL.mp3",
  },
  {
    code: "major-headcase",
    title: "Major Headcase",
    audioFile: "/audio/MAJOR HEADCASE.mp3",
  },
  {
    code: "outrage",
    title: "Outrage",
    audioFile: "/audio/OUTRAGE.mp3",
  },
  {
    code: "take-back",
    title: "Take Back",
    audioFile: "/audio/TAKE BACK.mp3",
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
