import fontUrl from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
import { CLOUD_FONT } from './cloudFont';

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(blob);
  });

let cached: string | undefined;

// A downloaded svg, and the svg drawn onto the png canvas, cannot reach the
// page's web fonts, so the font travels inside the file as a data url. On
// failure the download still works, just with the fallback font.
export const cloudFontFaceCss = async (): Promise<string> => {
  if (cached) return cached;

  try {
    const response = await fetch(fontUrl);
    const dataUrl = await blobToDataUrl(await response.blob());
    cached = `@font-face{font-family:'${CLOUD_FONT}';src:url(${dataUrl}) format('woff2');}`;
    return cached;
  } catch {
    return '';
  }
};
