const getRandomColor = require('randomcolor');

const MAX_ARRAY_SIZE = 50;

const wordCountToCloudInput = (wordCount) => {
  if (wordCount[0] < wordCount[wordCount.length - 1]) {
    throw new Error('Expected a sorted array!');
  }

  if (wordCount.length > MAX_ARRAY_SIZE) {
    wordCount.length = MAX_ARRAY_SIZE;
  }

  let maxValue = -Infinity;
  let minValue = Infinity;

  const cloudInput = wordCount.map((word) => {
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

function normalizeSizes({
  words,
  currentMax,
  currentMin,
  absoluteMax = 70,
  absoluteMin = 20,
}) {
  const normalize = (size) => {
    const normalized =
      ((size - currentMin) / (currentMax - currentMin)) * absoluteMax;
    return normalized > absoluteMin ? normalized : absoluteMin;
  };
  return words.map((word) => ({
    ...word,
    size: normalize(word.size),
  }));
}

module.exports = { wordCountToCloudInput };
