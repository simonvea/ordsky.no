export interface WordCount {
  [k: string]: number;
}

export async function countWords(string: string): Promise<WordCount> {
  const regExp = /\S+/gi;
  const wordsRaw = string.toUpperCase().match(regExp);
  const words = wordsRaw
    ?.map((word) => word.replace(/[!#$%&'()*,./:;=?^_`{}~´-]/g, ''))
    .filter((word) => word.length > 0);
  const count: WordCount = {};

  if (words) {
    words.forEach((word) => {
      const isCounted = Object.keys(count).some(
        (countedWord) => countedWord === word
      );
      if (isCounted) {
        count[word] += 1;
      } else {
        count[word] = 1;
      }
    });
  }

  return count;
}
