import { produce } from 'immer';
import { Cloud, WordCount } from '../../common/core/cloud.types';

export interface SessionState {
  isAdmin: boolean;
  wordEntries: number;
  id: string;
  cloud?: Cloud[];
  wordCount?: WordCount;
  errorMessage?: string;

  // UI state
  ui: 'idle' | 'waiting' | 'wordsInput' | 'error' | 'cloudDisplay';
}

export type SessionEvent =
  | { type: 'SESSION_STARTED'; id: string }
  | { type: 'SESSION_JOINED'; id: string }
  | { type: 'WORDS_ADDED'; totalEntries: number }
  | { type: 'WORDS_SENT' }
  | { type: 'CLOUD_CREATED'; cloud: Cloud[]; wordCount: WordCount }
  | { type: 'SESSION_ENDED' }
  | { type: 'ERROR'; error: Error };

export const initialState: SessionState = {
  isAdmin: false,
  wordEntries: 0,
  id: '',
  ui: 'idle',
};

export const sessionReducer = produce(
  (draft: SessionState, action: SessionEvent) => {
    switch (action.type) {
      case 'SESSION_STARTED': {
        draft.isAdmin = true;
        draft.id = action.id;
        draft.ui = 'waiting';
        break;
      }
      case 'SESSION_JOINED': {
        draft.id = action.id;
        draft.ui = 'wordsInput';
        break;
      }
      case 'WORDS_ADDED': {
        draft.wordEntries = action.totalEntries;
        break;
      }
      case 'WORDS_SENT': {
        draft.ui = 'waiting';
        break;
      }
      case 'CLOUD_CREATED': {
        draft.cloud = action.cloud;
        draft.wordCount = action.wordCount;
        draft.ui = 'cloudDisplay';
        break;
      }
      case 'SESSION_ENDED': {
        return initialState;
        break;
      }
      case 'ERROR': {
        draft.ui = 'error';
        draft.errorMessage = action.error.message;
        break;
      }
      default: {
        break;
      }
    }
  },
  initialState
);
