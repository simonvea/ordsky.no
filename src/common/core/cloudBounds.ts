import { Cloud } from './cloud.types';

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

// d3-cloud gives each word the box it measured with the real font, relative to
// the word's own position (x0/x1/y0/y1 already include rotation).
export const cloudBounds = (cloud: Cloud[]): Bounds => ({
  minX: Math.min(...cloud.map((w) => w.x + w.x0)),
  maxX: Math.max(...cloud.map((w) => w.x + w.x1)),
  minY: Math.min(...cloud.map((w) => w.y + w.y0)),
  maxY: Math.max(...cloud.map((w) => w.y + w.y1)),
});
