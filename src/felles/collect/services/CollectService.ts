import { Session } from 'react-router';
import { Cloud, WordCount } from '../../../common/core/cloud.types';
import { generateId } from '../../../common/core/session';

export type SessionState = {
  id: string;
  cloud?: Cloud[];
  wordCount?: WordCount;
  words: string[];
  numberOfEntries: number;
};

export interface CollecService {
  startSession: () => Promise<SessionState>;

  getSession: (id: string) => Promise<SessionState>;

  saveWords: ({}: { id: string; words: string[] }) => Promise<SessionState>;

  createCloud: (
    id: string
  ) => Promise<SessionState & { cloud: Cloud[]; wordCount: WordCount }>;
}

export class CollectService implements CollecService {
  async startSession(): Promise<SessionState> {
    return { id: generateId(), words: [], numberOfEntries: 0 };
  }

  async getSession(id: string): Promise<SessionState> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({ id, words: [], numberOfEntries: 0 });
      }, 2000);
    });
  }

  async saveWords({
    id,
    words,
  }: {
    id: string;
    words: string[];
  }): Promise<SessionState> {
    return { id, words, numberOfEntries: 1 };
  }

  async createCloud(
    id: string
  ): Promise<SessionState & { cloud: Cloud[]; wordCount: WordCount }> {
    return {
      id,
      numberOfEntries: 1,
      cloud: [],
      words: ['test'],
      wordCount: [{ text: 'test', count: 0 }],
    };
  }
}
