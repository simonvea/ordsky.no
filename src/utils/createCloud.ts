import { select } from 'd3-selection';

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
