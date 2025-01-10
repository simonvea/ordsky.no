import { select } from 'd3-selection';
import d3cloud from 'd3-cloud';
import { Cloud, CloudInput, CloudConfig } from './cloud.types';

export function createCloudSvg(cloud: Cloud[], config?: CloudConfig): string {
  const div = document.createElement('div');

  const width = config?.svgWidth || 500;
  const height = config?.svgHeight || 300;

  // Find bounds of word cloud
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  cloud.forEach((word) => {
    const wordWidth = word.size * word.text.length * 0.6; // Approximate width
    const wordHeight = word.size;

    minX = Math.min(minX, word.x - wordWidth / 2);
    maxX = Math.max(maxX, word.x + wordWidth / 2);
    minY = Math.min(minY, word.y - wordHeight / 2);
    maxY = Math.max(maxY, word.y + wordHeight / 2);
  });

  // Calculate scale factor
  const cloudWidth = maxX - minX;
  const cloudHeight = maxY - minY;
  const scale = Math.min(
    Math.min(width / cloudWidth, height / cloudHeight) * 0.85,
    1
  );

  select(div)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'En ordsky som viser de mest brukte ordene i teksten')
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2}) scale(${scale})`)
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

  return div.innerHTML;
}

export const createCloud = (
  words: CloudInput[],
  config?: CloudConfig
): Promise<Cloud[]> =>
  new Promise((resolve) => {
    const svgWidth = config?.svgWidth || 500;
    const svgHeight = config?.svgHeight || 300;
    const paddingBetweenWords = config?.padding || 2;

    const rotationDeg = config?.rotationDeg;
    const font = config?.font || 'Impact';

    d3cloud()
      .size([svgWidth, svgHeight])
      .words(words)
      .padding(paddingBetweenWords)
      .rotate(() => rotationDeg || (Math.trunc(Math.random() * 6) - 3) * 30)
      .font(font)
      .fontSize((d) => d.size as number)
      .on('end', resolve)
      .start();
  });
