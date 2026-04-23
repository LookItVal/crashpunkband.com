function stripExtension(sourcePath: string) {
  return sourcePath.replace(/\.[^.]+$/, "");
}

export function getResponsiveVariantPath(sourcePath: string, width: number) {
  const basePath = stripExtension(sourcePath);
  return `/responsive${basePath}-${width}w.webp`;
}

export function buildResponsiveSrcSet(sourcePath: string, widths: number[]) {
  return widths
    .map((width) => `${getResponsiveVariantPath(sourcePath, width)} ${width}w`)
    .join(", ");
}
