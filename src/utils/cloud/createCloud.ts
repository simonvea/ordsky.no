import { select } from 'd3-selection';
import d3cloud from 'd3-cloud';
import getRandomColor from 'randomcolor';
import { WordsInput, WordCount } from '../../context/form/formsReducer.types';
import { Cloud, CloudInput, CloudConfig } from './cloud.types';

export function createCloud(cloud: Cloud[]): SVGElement {
  const div = document.createElement('div');

  select(div)
    .append('svg')
    .attr('width', 500) // layout.size()[0]
    .attr('height', 300) // layout.size()[1]
    .append('g')
    .attr('transform', `translate(${500 / 2},${300 / 2})`)
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

export const generateCloud = (
  words: CloudInput[],
  callBack: (wordsFinished: Cloud[]) => void,
  config?: CloudConfig
): void => {
  const svgWidth = config?.svgWidth || 500;
  const svgHeight = config?.svgHeight || 300;
  const paddingBetweenWords = config?.padding || 2;
  const rotationDeg = config?.rotationDeg || Math.random() * 4 * 45 - 45;
  const font = config?.font || 'Impact';

  d3cloud()
    .size([svgWidth, svgHeight])
    .words(words)
    .padding(paddingBetweenWords)
    .rotate(() => rotationDeg)
    .font(font)
    .fontSize((d) => d.size as number)
    .on('end', callBack)
    .start();
};

export function normalizeSizes(
  words: CloudInput[],
  minSize = 20,
  maxSize = 60
): CloudInput[] {
  const sizes = words.map((word) => {
    return Number.isNaN(word.size) ? 1 : word.size;
  });
  const max = Math.max(...sizes);
  const min = Math.min(...sizes);
  const normalize = (size: number): number => {
    const normalized = ((size - min) / (max - min)) * maxSize;
    return normalized > minSize ? normalized : minSize;
  };
  return words.map((word, index) => ({
    ...word,
    size: normalize(sizes[index]),
  }));
}

export const addColorToWordsInput = (words: WordsInput[]): CloudInput[] => {
  return words.map((word) => ({
    text: word.word.toUpperCase(),
    size: Number.parseInt(word.size, 10),
    fill: getRandomColor(),
  }));
};

export const wordCountToCloudInput = (wordCount: WordCount): CloudInput[] => {
  const words = Object.keys(wordCount);
  const cloudInput = words.map((word) => ({
    text: word,
    size: wordCount[word],
    fill: getRandomColor(),
  }));
  const normalizedSizes = normalizeSizes(cloudInput);
  return normalizedSizes.sort((a, b) => b.size - a.size);
};

export const wordsInputToCloudInput = (
  wordsInput: WordsInput[]
): CloudInput[] => {
  const wordsWithColor = addColorToWordsInput(wordsInput);
  const wordsWithSize = normalizeSizes(wordsWithColor);
  const wordsSorted = wordsWithSize.sort((a, b) => b.size - a.size);
  return wordsSorted;
};
