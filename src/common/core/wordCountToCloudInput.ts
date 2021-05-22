import getRandomColor from 'randomcolor';
import { CloudInput, WordCount } from './cloud.types';
import { reduceTooBigWords } from './createCloud';

const MAX_ARRAY_SIZE = 50;

export const wordCountToCloudInput = (wordCount: WordCount): CloudInput[] => {
  if (wordCount[0].count < wordCount[wordCount.length - 1].count) {
    throw new Error('Expected a sorted array!');
  }

  const count = wordCount.slice(0, MAX_ARRAY_SIZE);

  const maxValue = count[0].count;
  const minValue = count[count.length - 1].count;

  const cloudInput = count.map((word) => ({
    text: word.text.toUpperCase(),
    size: word.count,
    fill: getRandomColor(),
  }));

  const normalizedSizes = normalizeSizes({
    words: cloudInput,
    currentMax: maxValue,
    currentMin: minValue,
  });

  return reduceTooBigWords(normalizedSizes);
};

type NormalizeSizesInput = {
  words: CloudInput[];
  currentMax: number;
  currentMin: number;
  absoluteMax?: number;
  absoluteMin?: number;
};

function normalizeSizes({
  words,
  currentMax,
  currentMin,
  absoluteMax = 70,
  absoluteMin = 10,
}: NormalizeSizesInput): CloudInput[] {
  const normalize = (size: number): number => {
    const normalized =
      ((size - currentMin) / (currentMax - currentMin)) * absoluteMax;
    return normalized > absoluteMin ? normalized : absoluteMin;
  };
  return words.map((word) => ({
    ...word,
    size: normalize(word.size),
  }));
}
