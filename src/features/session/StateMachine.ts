import { Machine, assign } from 'xstate';
import { generateId } from './helpers';
import {
  JoinSessionEvent,
  AddWordsEvent,
  SessionContext,
  SessionEvent,
  SessionStateSchema,
} from './StateMachine.types';

export const sessionMachine = Machine<
  SessionContext,
  SessionStateSchema,
  SessionEvent
>(
  {
    id: 'session',
    context: { isAdmin: false, wordEntries: 0, id: '' },
    initial: 'idle',
    on: {
      RESTART: {
        target: 'idle',
        actions: ['restart'],
      },
    },
    states: {
      idle: {
        on: {
          START_SESSION: {
            target: 'waiting',
            actions: ['setAsAdmin', 'generateAndAddId'],
          },
          JOIN_SESSION: {
            target: 'wordsInput',
            actions: ['addId'],
          },
        },
      },
      wordsInput: {
        on: {
          ADD_WORDS: {
            target: 'waiting',
            actions: ['sendWords'],
            cond: (context, event) => event.words && event.words.length > 1,
          },
        },
      },
      waiting: {
        invoke: [
          {
            id: 'wordsListener',
            src: 'listenToWords',
          },
          {
            id: 'cloudListener',
            src: 'listenForCloud',
          },
        ],
        on: {
          WORDS_ADDED: {
            actions: ['addToWordEntries'],
          },
          CREATE_CLOUD: 'creating',
          CLOUD_CREATED: 'created',
        },
      },
      creating: {
        on: {
          CLOUD_CREATED: 'created',
        },
      },
      created: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      setAsAdmin: assign<SessionContext, SessionEvent>({ isAdmin: true }),
      generateAndAddId: assign<SessionContext, SessionEvent>({
        id: () => generateId(),
      }),
      addId: assign({ id: (context, event) => (event as JoinSessionEvent).id }),
      addToWordEntries: assign({
        wordEntries: (context) => context.wordEntries + 1,
      }),
      sendWords: (context, event) => {
        // Send words to backend..
        console.log((event as AddWordsEvent).words);
      },
      restart: assign<SessionContext, SessionEvent>({
        id: '',
        isAdmin: false,
        wordEntries: 0,
      }),
    },
    services: {
      listenToWords: () => (
        callback
        // eslint-disable-next-line unicorn/consistent-function-scoping
      ): (() => void) => {
        // TODO: Use context.id in SessionService to listen to correct collection..
        const id = setInterval(() => callback('WORDS_ADDED'), 1000);

        return () => clearInterval(id);
      },
      // eslint-disable-next-line unicorn/consistent-function-scoping
      listenForCloud: () => (callback) => {
        // TODO: Use context.id in SessionService to listen to correct collection..

        setTimeout(() => {
          callback('CLOUD_CREATED');
        }, 5000);
      },
    },
  }
);
