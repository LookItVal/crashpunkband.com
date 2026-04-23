import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const RESPONSIVE_DIR = path.join(PUBLIC_DIR, "responsive");

const TARGETS = [
  {
    source: "crash_banner.webp",
    widths: [320, 480, 640, 768, 960, 1200],
    quality: 78,
  },
  {
    source: "Album_Cover.webp",
    widths: [256, 384, 512, 640, 768, 1024],
    quality: 76,
  },
  {
    source: "photos/CASHblack.webp",
    widths: [192, 256, 320, 384, 512, 640],
    quality: 74,
  },
  {
    source: "photos/KNOXXblack.webp",
    widths: [192, 256, 320, 384, 512, 640],
    quality: 74,
  },
  {
    source: "photos/FISHblack.webp",
    widths: [192, 256, 320, 384, 512, 640],
    quality: 74,
  },
];

function stripExtension(filePath) {
  return filePath.replace(/\.[^.]+$/, "");
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function buildTarget(sharp, target) {
  const sourceAbsolutePath = path.join(PUBLIC_DIR, target.source);
  const sourceRelativeNoExt = stripExtension(target.source);
  const outputSubdir = path.join(RESPONSIVE_DIR, path.dirname(sourceRelativeNoExt));
  const outputBaseName = path.basename(sourceRelativeNoExt);

  await ensureDir(outputSubdir);

  const image = sharp(sourceAbsolutePath, { failOn: "none" });
  const metadata = await image.metadata();

  if (!metadata.width) {
    throw new Error(`Unable to determine width for ${target.source}`);
  }

  const usableWidths = target.widths.filter((width) => width <= metadata.width);
  if (!usableWidths.includes(metadata.width)) {
    usableWidths.push(metadata.width);
  }

  const uniqueWidths = [...new Set(usableWidths)].sort((a, b) => a - b);

  for (const width of uniqueWidths) {
    const outputFileName = `${outputBaseName}-${width}w.webp`;
    const outputAbsolutePath = path.join(outputSubdir, outputFileName);

    await sharp(sourceAbsolutePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: target.quality })
      .toFile(outputAbsolutePath);
  }

  return {
    source: `/${target.source}`,
    generatedDir: `/${path.posix.join("responsive", path.posix.dirname(sourceRelativeNoExt))}`,
    baseName: outputBaseName,
    widths: uniqueWidths,
    quality: target.quality,
  };
}

async function main() {
  let sharp;

  try {
    const sharpModule = await import("sharp");
    sharp = sharpModule.default;
  } catch {
    throw new Error('Missing dependency "sharp". Run: pnpm add -D sharp');
  }

  await ensureDir(RESPONSIVE_DIR);

  const manifest = [];

  for (const target of TARGETS) {
    const output = await buildTarget(sharp, target);
    manifest.push(output);
    console.log(`Generated responsive variants for ${target.source}`);
  }

  const manifestPath = path.join(RESPONSIVE_DIR, "manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Wrote manifest: ${path.relative(ROOT, manifestPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
