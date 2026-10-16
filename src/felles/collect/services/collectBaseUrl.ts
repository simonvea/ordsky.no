// Kept in its own module so jest (CommonJS, no import.meta) can mock it away.
export const collectBaseUrl: string = import.meta.env.VITE_COLLECT_BASE_URL;
