export type CloudBackground = 'transparent' | 'white';

// Word colours are picked to read on white (wordCountToCloudInput), so white
// needs no recolouring.
export const backgroundFill: Record<CloudBackground, string | undefined> = {
  transparent: undefined,
  white: '#ffffff',
};

const STORAGE_KEY = 'ordsky.cloudBackground';

const isCloudBackground = (value: unknown): value is CloudBackground =>
  value === 'transparent' || value === 'white';

// Storage can throw in private windows or with blocked site data; the choice
// is a convenience, so falling back to the default is fine.
export const loadCloudBackground = (): CloudBackground => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isCloudBackground(stored) ? stored : 'transparent';
  } catch {
    return 'transparent';
  }
};

export const saveCloudBackground = (background: CloudBackground): void => {
  try {
    localStorage.setItem(STORAGE_KEY, background);
  } catch {
    // Not remembered, see loadCloudBackground.
  }
};
