import filter from './filter.json';
import { WordCount } from './cloud.types';

const isNotNumber = (w: string): boolean =>
  Number.isNaN(Number.parseInt(w, 10));

const wordsFilter = (word: string): boolean =>
  word.length > 2 && isNotNumber && !filter.includes(word);

export async function countWords(string: string): Promise<WordCount> {
  const regExp = /\S+/gi;
  const wordsRaw = string.toUpperCase().match(regExp);

  const words = wordsRaw
    ?.map((word) =>
      word
        .replace(/[!#$%&'()*+,./:;=?^_`{}~´]/g, '') // TODO: also remove digits "\d"?
        .replace(/^-/g, '')
        .replace(/-$/g, '')
    )
    .filter((w) => wordsFilter(w));

  const count: { [k: string]: number } = {};

  if (words) {
    words.forEach((word) => {
      if (count[word]) {
        count[word] += 1;
      } else {
        count[word] = 1;
      }
    });
  }

  const countedWords = Object.keys(count);
  const countedArray = countedWords.map((word) => ({
    text: word,
    count: count[word],
  }));
  return countedArray.sort((a, b) => b.count - a.count);
}
