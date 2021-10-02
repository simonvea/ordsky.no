import getRandomColor from 'randomcolor';
import { Cloud, CloudInput, WordCount } from './cloud.types';
import { createCloud } from './createCloud';

export const createCloudFromWordCount = async (
  wordCount: WordCount
): Promise<Cloud[]> => {
  const cloudInput: CloudInput[] = wordCountToCloudInput(wordCount);

  return createCloud(cloudInput);
};

const MAX_ARRAY_SIZE = 50;

export function wordCountToCloudInput(wordCount: WordCount): CloudInput[] {
  const wordsSorted = wordCount.sort((a, b) => b.count - a.count);

  const count = wordsSorted.slice(0, MAX_ARRAY_SIZE);

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
}

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

export function reduceTooBigWords(
  words: CloudInput[],
  maxPixels = 300,
  minSize = 10
): CloudInput[] {
  let sizeReduction = 0;

  return words.map((n) => {
    const { size, text } = n;

    if ((size - sizeReduction) * text.length > maxPixels) {
      sizeReduction = Math.ceil(size - maxPixels / text.length);
    }

    return {
      ...n,
      size: size - sizeReduction > minSize ? size - sizeReduction : minSize,
    };
  });
}
