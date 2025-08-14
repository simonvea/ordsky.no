import '@testing-library/jest-dom';

const globalThisAny = globalThis as any;

if (!globalThisAny.TextEncoder || !globalThisAny.TextDecoder) {
  const { TextDecoder, TextEncoder } = require('node:util');
  globalThisAny.TextEncoder = TextEncoder;
  globalThisAny.TextDecoder = TextDecoder;
}
