import { Cloud, WordCount } from '../../../common/core/cloud.types';
import { createCloud, createCloudSvg } from '../../../common/core/createCloud';
import { wordCountToCloudInput } from '../../../common/core/wordCountToCloudInput';

export type SessionState = {
  id: string;
  cloud?: Cloud[];
  wordCount?: WordCount;
  words: string[];
  numberOfEntries: number;
  createdAt: string;
  updatedAt: string;
};

const baseUrl = '/api/felles';

export const getSession = async (id: string): Promise<SessionState> => {
  const response = await fetch(`${baseUrl}/${id}`);

  if (!response.ok) {
    console.error('Error fetching session', response);
    throw new Error('404');
  }

  return response.json();
};

export const saveWords = async ({
  id,
  words,
}: {
  id: string;
  words: string[];
}): Promise<SessionState> => {
  const response = await fetch(`${baseUrl}/${id}/words`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(words),
  });
  return response.json();
};

export const getWordsAndCreateCloud = async (
  id: string
): Promise<SessionState & { cloud: Cloud[]; wordCount: WordCount }> => {
  const { words } = await getSession(id);

  const counted = new Set();
  let wordCount: WordCount = [];

  words.forEach((w) => {
    const word = w.toUpperCase();

    if (counted.has(word)) {
      wordCount = wordCount.map((count) => ({
        text: count.text,
        count: count.text === word ? count.count + 1 : count.count,
      }));
    } else {
      wordCount.push({
        text: word,
        count: 1,
      });
      counted.add(word);
    }
  });

  const sortedWordCount = wordCount.sort((a, b) => b.count - a.count);

  const cloudInput = wordCountToCloudInput(sortedWordCount);

  const cloud = await createCloud(cloudInput);

  const svg = createCloudSvg(cloud);

  const response = await fetch(`${baseUrl}/${id}/cloud`, {
    method: 'PUT',
    body: JSON.stringify(svg),
  });
  return response.json();
};