import { Machine, assign } from 'xstate';
import { generateId } from './helpers';
import {
  JoinSessionEvent,
  AddWordsEvent,
  SessionContext,
  SessionEvent,
  SessionStateSchema,
  CloudCreatedEvent,
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
          CLOUD_CREATED: {
            target: 'created',
            actions: ['addCloudToContext'],
          },
        },
      },
      creating: {
        invoke: {
          id: 'createCloud',
          src: 'createCloud',
        },
        on: {
          CLOUD_CREATED: {
            target: 'created',
            actions: ['addCloudToContext'],
          },
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
      addCloudToContext: assign<SessionContext, SessionEvent>({
        cloud: (context, event) => (event as CloudCreatedEvent).cloud,
      }),
      restart: assign<SessionContext, SessionEvent>({
        id: '',
        isAdmin: false,
        wordEntries: 0,
      }),
    },
    /* eslint-disable unicorn/consistent-function-scoping */
    services: {
      listenToWords: () => (callback): (() => void) => {
        // TODO: Use context.id in SessionService to listen to correct collection..
        const id = setInterval(() => callback('WORDS_ADDED'), 1000);

        return () => clearInterval(id);
      },
      listenForCloud: (context) => (callback) => {
        if (context.isAdmin) return; // TODO: Should this be checked for elsewhere?
        // TODO: Use context.id in SessionService to listen to correct collection..
        setTimeout(() => {
          callback('CLOUD_CREATED');
        }, 5000);
      },
      createCloud: () => (callback) => {
        setTimeout(() => {
          callback('CLOUD_CREATED');
        }, 2000);
      },
    },
    /* eslint-enable unicorn/consistent-function-scoping */
  }
);
