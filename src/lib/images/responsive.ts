import responsiveManifest from "../../../public/responsive/manifest.json";

function stripExtension(sourcePath: string) {
  return sourcePath.replace(/\.[^.]+$/, "");
}

type ResponsiveManifestEntry = {
  source: string;
  generatedDir: string;
  baseName: string;
  widths: number[];
  quality: number;
};

const manifestEntries = responsiveManifest as ResponsiveManifestEntry[];

function getManifestEntry(sourcePath: string) {
  return manifestEntries.find((entry) => entry.source === sourcePath);
}

function resolveAvailableWidths(sourcePath: string, requestedWidths: number[]) {
  const manifestEntry = getManifestEntry(sourcePath);

  if (!manifestEntry) {
    return requestedWidths;
  }

  const sortedRequestedWidths = [...new Set(requestedWidths)].sort((a, b) => a - b);
  const maxRequestedWidth = sortedRequestedWidths[sortedRequestedWidths.length - 1];
  const manifestWidths = [...manifestEntry.widths].sort((a, b) => a - b);

  const matchingWidths = manifestWidths.filter((width) => width <= maxRequestedWidth);
  const fallbackLargestWidth = manifestWidths[manifestWidths.length - 1];

  if (matchingWidths.length > 0) {
    if (matchingWidths[matchingWidths.length - 1] !== fallbackLargestWidth && fallbackLargestWidth <= maxRequestedWidth) {
      matchingWidths.push(fallbackLargestWidth);
    }
    return matchingWidths;
  }

  return [fallbackLargestWidth];
}

export function getResponsiveVariantPath(sourcePath: string, width: number) {
  const basePath = stripExtension(sourcePath);
  return `/responsive${basePath}-${width}w.webp`;
}

export function buildResponsiveSrcSet(sourcePath: string, widths: number[]) {
  return resolveAvailableWidths(sourcePath, widths)
    .map((width) => `${getResponsiveVariantPath(sourcePath, width)} ${width}w`)
    .join(", ");
}
