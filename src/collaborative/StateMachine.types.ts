import { WordCount, Cloud } from '../common/core/cloud.types';

// The hierarchical (recursive) schema for the states
export interface SessionStateSchema {
  states: {
    idle: Record<string, unknown>;
    startSession: Record<string, unknown>;
    wordsInput: Record<string, unknown>;
    addWords: Record<string, unknown>;
    waiting: Record<string, unknown>;
    creating: Record<string, unknown>;
    created: Record<string, unknown>;
    error: Record<string, unknown>;
  };
}

export type StartSessionEvent = { type: 'START_SESSION' };
export type SessionStartedEvent = { type: 'SESSION_STARTED' };
export type JoinSessionEvent = {
  type: 'JOIN_SESSION';
  id: string;
  isAdmin?: boolean;
};
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
