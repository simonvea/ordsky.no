import { select } from 'd3-selection';
import d3cloud from 'd3-cloud';
import { Cloud, CloudInput, CloudConfig } from './cloud.types';

export function createCloudSvg(
  cloud: Cloud[],
  config?: CloudConfig
): SVGElement {
  const div = document.createElement('div');

  const width = config?.svgWidth || 500;
  const height = config?.svgHeight || 300;

  select(div)
    .append('svg')
    .attr('width', width) // layout.size()[0]
    .attr('height', height) // layout.size()[1]
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
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

export const createCloud = (
  words: CloudInput[],
  config?: CloudConfig
): Promise<Cloud[]> =>
  new Promise((resolve) => {
    const svgWidth = config?.svgWidth || 500;
    const svgHeight = config?.svgHeight || 300;
    const paddingBetweenWords = config?.padding || 2;
    // eslint-disable-next-line no-bitwise
    const rotationDeg =
      config?.rotationDeg || (Math.trunc(Math.random() * 6) - 3) * 30;
    // TODO: Implement;
    const font = config?.font || 'Impact';

    d3cloud()
      .size([svgWidth, svgHeight])
      .words(words)
      .padding(paddingBetweenWords)
      .rotate(() => rotationDeg)
      .font(font)
      .fontSize((d) => d.size as number)
      .on('end', resolve)
      .start();
  });
