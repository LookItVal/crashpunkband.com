import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SONGS_CONFIG_PATH = path.join(ROOT, "src", "config", "songs.ts");
const APP_DIR = path.join(ROOT, "src", "app");
const MARKER_FILE = ".song-generated";

function extractSongCodes(sourceText) {
  const codes = [];
  const codeRegex = /code:\s*"([^"]+)"/g;

  let match = codeRegex.exec(sourceText);
  while (match) {
    codes.push(match[1]);
    match = codeRegex.exec(sourceText);
  }

  return [...new Set(codes)];
}

function validateCode(code) {
  return /^[a-zA-Z0-9-]+$/.test(code);
}

function createPageSource(code) {
  return `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SongCodePage from "@/components/CRASHTheme/SongCodePage";
import { getSongByCode } from "@/config/songs";

const song = getSongByCode("${code}");

export const metadata: Metadata = {
  title: song ? \`CRASH - \${song.title}\` : "CRASH",
  description: song ? \`Listen to \${song.title} by CRASH.\` : "Listen now.",
};

export default function SongPage() {
  if (!song) {
    notFound();
  }

  return <SongCodePage song={song} />;
}
`;
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function getGeneratedCodeDirs() {
  const entries = await fs.readdir(APP_DIR, { withFileTypes: true });
  const generatedDirs = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const markerPath = path.join(APP_DIR, entry.name, MARKER_FILE);
    if (await exists(markerPath)) {
      generatedDirs.push(entry.name);
    }
  }

  return generatedDirs;
}

async function main() {
  const songsSource = await fs.readFile(SONGS_CONFIG_PATH, "utf8");
  const codes = extractSongCodes(songsSource);

  if (codes.length === 0) {
    throw new Error("No song codes found in src/config/songs.ts");
  }

  for (const code of codes) {
    if (!validateCode(code)) {
      throw new Error(`Invalid code slug: ${code}. Use only letters, numbers, and hyphens.`);
    }
  }

  const generatedDirs = await getGeneratedCodeDirs();
  const staleGeneratedDirs = generatedDirs.filter((dir) => !codes.includes(dir));

  for (const dir of staleGeneratedDirs) {
    await fs.rm(path.join(APP_DIR, dir), { recursive: true, force: true });
  }

  for (const code of codes) {
    const codeDir = path.join(APP_DIR, code);
    await fs.mkdir(codeDir, { recursive: true });
    await fs.writeFile(path.join(codeDir, MARKER_FILE), `${code}\n`, "utf8");
    await fs.writeFile(path.join(codeDir, "page.tsx"), createPageSource(code), "utf8");
  }

  console.log(`Generated ${codes.length} song page(s): ${codes.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
