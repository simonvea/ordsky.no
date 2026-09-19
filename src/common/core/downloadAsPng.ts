import { downloadFile, todayStamp } from "./downloadFile";
import { serializeSvg } from "./serializeSvg";

interface DownloadOptions {
  filename?: string;
  width?: number;
  height?: number;
  scale?: number;
  quality?: number;
  backgroundColor?: string;
  format?: "png" | "jpeg";
  addTimestamp?: boolean;
}

export const downloadAsPng = async (
  svg: SVGElement,
  options: DownloadOptions = {},
): Promise<void> => {
  const {
    filename = "ordsky",
    width = 500,
    height = 500,
    scale = window.devicePixelRatio || 1,
    quality = 1,
    backgroundColor = "transparent",
    format = "png",
    addTimestamp = true,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: format === "png" });

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Set canvas dimensions with DPI scaling
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  try {
    const svgUrl = svgDataURL(svg);
    const img = await loadImage(svgUrl);

    //  maintain aspect ratio
    const svgAspect = img.width / img.height;
    const canvasAspect = width / height;
    let renderWidth = width;
    let renderHeight = height;

    if (svgAspect > canvasAspect) {
      renderHeight = width / svgAspect;
    } else {
      renderWidth = height * svgAspect;
    }

    // Center the image
    const x = (width - renderWidth) / 2;
    const y = (height - renderHeight) / 2;

    ctx.drawImage(img, x, y, renderWidth, renderHeight);

    // Generate filename with timestamp if needed
    const timestamp = addTimestamp ? `-${todayStamp()}` : "";
    const finalFilename = `${filename}${timestamp}.${format}`;

    const url = canvas.toDataURL(`image/${format}`, quality);
    await downloadFile(url, finalFilename);
  } catch (error) {
    console.error("Failed to process image:", error);
    throw error;
  }
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

export function svgDataURL(svg: SVGElement): string {
  try {
    const svgAsXML = serializeSvg(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgAsXML)))}`;
  } catch (error) {
    console.error("Failed to serialize SVG:", error);
    throw error;
  }
}
