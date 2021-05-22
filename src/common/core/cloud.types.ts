export interface Cloud {
  text: string;
  size: number;
  fill: string;
  font: string;
  style: string;
  weight: string;
  rotate: number;
  padding: number;
  width: number;
  height: number;
  xoff: number;
  yoff: number;
  x1: number;
  y1: number;
  x0: number;
  y0: number;
  hasText: boolean;
  x: number;
  y: number;
}

export type CloudInput = { text: string; size: number; fill: string };

export interface CloudConfig {
  svgWidth?: number;
  svgHeight?: number;
  padding?: number;
  rotationDeg?: number;
  font?: string;
}

export type WordCount = Array<{
  text: string;
  count: number;
}>;
