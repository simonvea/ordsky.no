// Self-hosted (index.tsx) so every platform lays out and renders the same
// font. Impact is missing on Linux and Android, where the fallback font
// overlapped words measured for Impact.
export const CLOUD_FONT = 'Anton';
export const CLOUD_FONT_STACK = "Anton, Impact, 'Arial Black', sans-serif";

// d3-cloud measures words on a canvas, which silently uses the fallback font
// until the web font has loaded. If loading fails, the layout is measured
// with the fallback it will also be drawn with.
export const loadCloudFont = async (): Promise<void> => {
  try {
    await document.fonts?.load(`16px ${CLOUD_FONT}`);
  } catch {
    // Measured and drawn with the fallback font instead.
  }
};
