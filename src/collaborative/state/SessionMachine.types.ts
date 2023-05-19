import { WordCount, Cloud } from '../../common/core/cloud.types';

export type StartSessionEvent = { type: 'START_SESSION' };
export type SessionStartedEvent = { type: 'SESSION_STARTED' };
export type JoinSessionEvent = { type: 'JOIN_SESSION'; id: string };
export type AddWordsEvent = { type: 'ADD_WORDS'; words: string[] };
export type WordsAddedEvent = { type: 'WORDS_ADDED'; totalEntries: number };
export type CreateCloudEvent = { type: 'CREATE_CLOUD' };
export type CloudCreatedEvent = {
  type: 'CLOUD_CREATED';
  cloud: Cloud[];
  wordCount: WordCount;
};
export type Restart = { type: 'RESTART' };

// The events that the machine handles
export type SessionEvent =
  | StartSessionEvent
  | SessionStartedEvent
  | JoinSessionEvent
  | AddWordsEvent
  | WordsAddedEvent
  | CreateCloudEvent
  | CloudCreatedEvent
  | Restart;

// The context (extended state) of the machine
export interface SessionContext {
  isAdmin: boolean;
  wordEntries: number;
  id: string;
  cloud?: Cloud[];
  wordCount?: WordCount;
  errorMessage?: string;
}
// The hierarchical (recursive) schema for the states
export type SessionTypestate =
  | {
      value: 'idle';
      context: SessionContext & { isAdmin: false; wordEntries: 0; id: '' };
    }
  | {
      value: 'startSession';
      context: SessionContext;
    }
  | {
      value: 'wordsInput';
      context: SessionContext;
    }
  | {
      value: 'addWords';
      context: SessionContext;
    }
  | {
      value: 'waiting';
      context: SessionContext;
    }
  | {
      value: 'creating';
      context: SessionContext;
    }
  | {
      value: 'created';
      context: SessionContext;
    }
  | {
      value: 'error';
      context: SessionContext;
    };
