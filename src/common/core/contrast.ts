import getRandomColor from 'randomcolor';

// Cloud words are large text, for which WCAG asks for 3:1.
export const MIN_CONTRAST = 3;

const linearize = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const n = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * linearize(n >> 16) +
    0.7152 * linearize((n >> 8) & 255) +
    0.0722 * linearize(n & 255)
  );
};

export const contrastRatio = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].toSorted((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const MAX_ATTEMPTS = 200;

// The cloud is shown on the dark page but downloaded transparent for white
// slides, so a color must read on both. randomcolor cannot guarantee that, so
// we reject and redraw. The mid-grey fallback keeps the function total.
export const randomReadableColor = (backgrounds: string[]): string => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const color = getRandomColor();
    if (backgrounds.every((bg) => contrastRatio(color, bg) >= MIN_CONTRAST)) {
      return color;
    }
  }
  return '#808080';
};
