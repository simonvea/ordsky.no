import { select } from 'd3-selection';
import d3cloud from 'd3-cloud';
import { Cloud, CloudInput, CloudConfig } from './cloud.types';
import { cloudBounds } from './cloudBounds';

export function createCloudSvg(cloud: Cloud[], config?: CloudConfig): string {
  const div = document.createElement('div');

  const width = config?.svgWidth || 500;
  const height = config?.svgHeight || 300;

  // d3-cloud drops words that do not fit, so the layout can come back empty.
  const { minX, maxX, minY, maxY } =
    cloud.length > 0
      ? cloudBounds(cloud)
      : { minX: 0, maxX: 0, minY: 0, maxY: 0 };

  const cloudWidth = maxX - minX;
  const cloudHeight = maxY - minY;
  const fitScale = Math.min(width / cloudWidth, height / cloudHeight) * 0.85;
  const clampedScale = config?.upscale ? fitScale : Math.min(fitScale, 1);
  const scale = Number.isFinite(fitScale) ? clampedScale : 1;
  // Center on the words' actual bounds; d3-cloud only roughly centers them.
  const offsetX = width / 2 - (scale * (minX + maxX)) / 2;
  const offsetY = height / 2 - (scale * (minY + maxY)) / 2;

  select(div)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'En ordsky som viser de mest brukte ordene i teksten')
    .append('g')
    .attr('transform', `translate(${offsetX},${offsetY}) scale(${scale})`)
    .selectAll('text')
    .data(cloud)
    .enter()
    .append('text')
    .style('font-size', (d) => `${d.size}px`)
    // Fallbacks matter for the downloaded svg, which is opened on machines
    // without Impact; d3-cloud measured the layout with Impact.
    .style('font-family', "Impact, 'Arial Black', Haettenschweiler, sans-serif")
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
