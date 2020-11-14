import getRandomColor from 'randomcolor';
import { WordCount } from '../countWords';
import { CloudInput } from './cloud.types';

const MAX_ARRAY_SIZE = 50;

export const wordCountToCloudInput = (wordCount: WordCount): CloudInput[] => {
  if (wordCount[0] < wordCount[wordCount.length - 1]) {
    throw new Error('Expected a sorted array!');
  }

  const count = wordCount;

  if (wordCount.length > MAX_ARRAY_SIZE) {
    count.length = MAX_ARRAY_SIZE;
  }

  let maxValue = -Infinity;
  let minValue = Infinity;

  const cloudInput = count.map((word) => {
    if (word.count > maxValue) maxValue = word.count;
    if (word.count < minValue) minValue = word.count;

    return {
      text: word.text.toUpperCase(),
      size: word.count,
      fill: getRandomColor(),
    };
  });

  const normalizedSizes = normalizeSizes({
    words: cloudInput,
    currentMax: maxValue,
    currentMin: minValue,
  });

  return normalizedSizes;
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
  absoluteMin = 20,
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
