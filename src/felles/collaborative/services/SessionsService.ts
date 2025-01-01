import { WordCount, Cloud } from '../../../common/core/cloud.types';

export type WordsAddedEvent = { type: 'WORDS_ADDED'; numberOfEntries: number };
export type CloudCreatedEvent = {
  type: 'CLOUD_CREATED';
  cloud: Cloud[];
  wordCount: WordCount;
};
export type ErrorEvent = { type: 'ERROR'; error: Error };

export type SessionEvents = WordsAddedEvent | CloudCreatedEvent | ErrorEvent;

export interface SessionService {
  startSession: (id: string) => void;

  joinSession: (id: string) => void;

  isLiveSession: (id: string) => Promise<boolean>;

  subscribe(callback: (event: SessionEvents) => void): void;

  saveWords: ({}: { id: string; words: string[] }) => void;

  getAllWords: (id: string) => Promise<string[]>;

  createCloud: (
    words: string[]
  ) => Promise<{ cloud: Cloud[]; wordCount: WordCount }>;

  saveCloudAndWordCount: ({
    id,
    cloud,
    wordCount,
  }: {
    id: string;
    cloud: Cloud[];
    wordCount: WordCount;
  }) => void;
}
