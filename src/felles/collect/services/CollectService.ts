import { Cloud, WordCount } from '../../../common/core/cloud.types';
import { countWordsFromWords } from '../../../common/core/countWords';
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

export class ApiError extends Error {
  constructor(
    message: string,
    public response: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getSession = async (id: string): Promise<SessionState> => {
  const response = await fetch(`${baseUrl}/${id}`);

  if (!response.ok) {
    throw new ApiError('Error fetching session', response);
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

  if (!response.ok) {
    throw new ApiError('Error saving words', response);
  }

  return response.json();
};

export const saveCloud = async (
  id: string,
  cloud: Cloud[]
): Promise<SessionState> => {
  const response = await fetch(`${baseUrl}/${id}/cloud`, {
    method: 'PUT',
    body: JSON.stringify(cloud),
  });

  if (!response.ok) {
    throw new ApiError('Error saving cloud', response);
  }

  return response.json();
};

export const saveCloudAndWordCount = async (
  id: string,
  cloud: Cloud[],
  wordCount: WordCount
): Promise<SessionState> => {
  const respose = await fetch(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cloud, wordCount }),
  });

  if (!respose.ok) {
    throw new ApiError('Error saving cloud and wordCount', respose);
  }

  return respose.json();
};

export const getWordsAndCreateCloud = async (
  id: string
): Promise<{ cloud: Cloud[]; wordCount: WordCount }> => {
  const session = await getSession(id);

  const upperCasedWords = session.words.map((word) => word.toUpperCase());

  const wordCount = countWordsFromWords(upperCasedWords);

  const sortedWordCount = wordCount.sort((a, b) => b.count - a.count);

  const cloudInput = wordCountToCloudInput(sortedWordCount);

  const cloud = await createCloud(cloudInput);

  return { wordCount, cloud };
};
