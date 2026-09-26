import { downloadFile, todayStamp } from "./downloadFile";
import { SerializeOptions, serializeSvg, svgSize } from "./serializeSvg";

// The canvas takes the svg's own size, so the png has the cloud's aspect
// ratio instead of empty bands around it.
export const downloadAsPng = async (
  svg: SVGElement,
  options: SerializeOptions = {},
): Promise<void> => {
  const { width, height } = svgSize(svg);
  const scale = window.devicePixelRatio || 1;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  const img = await loadImage(svgDataURL(svg, options));
  ctx.drawImage(img, 0, 0, width, height);

  await downloadFile(canvas.toDataURL("image/png"), `ordsky-${todayStamp()}.png`);
};

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () =>
      reject(new Error("Failed to load image")),
    );
    img.src = url;
  });
}

function svgDataURL(svg: SVGElement, options: SerializeOptions): string {
  const svgAsXML = serializeSvg(svg, options);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgAsXML)))}`;
}
