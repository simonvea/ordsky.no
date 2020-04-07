import { select } from 'd3-selection';

export const downloadAsPng = (xml: string): void => {
  const canvas = document.createElement('canvas');
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d'
  ) as CanvasRenderingContext2D;
  canvas.height = 500;
  canvas.width = 500;
  // If you want a non transparent background for the wordCloud;
  // ctx.fillStyle = 'white';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0);
    const url = canvas.toDataURL();
    downloadOrdsky(url);
  });

  img.src = xml;
};

function downloadOrdsky(url: string): void {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  const a = document.createElement('a');
  a.setAttribute('download', 'ordsky.png');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.dispatchEvent(event);
}

export function svgDataURL(svg: SVGElement): string {
  const svgAsXML = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`;
}

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

export function createCloud(cloud: Cloud[]): SVGElement {
  const div = document.createElement('div');

  select(div)
    .append('svg')
    .attr('width', 500) // layout.size()[0]
    .attr('height', 500) // layout.size()[1]
    .append('g')
    .attr('transform', `translate(${500 / 2},${500 / 2})`)
    .selectAll('text')
    .data(cloud)
    .enter()
    .append('text')
    .style('font-size', (d) => `${d.size}px`)
    .style('font-family', 'Impact')
    .style('fill', (d) => d.fill)
    .attr('text-anchor', 'middle')
    .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
    .text((d) => d.text);

  return div.firstChild as SVGElement;
}
