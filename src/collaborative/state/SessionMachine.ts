import {
  assign,
  setup,
  fromPromise,
  fromCallback,
  type EventObject,
} from 'xstate';
import { generateId } from '../helpers';
import {
  AddWordsEvent,
  SessionContext,
  SessionEvent,
  CloudCreatedEvent,
  WordsAddedEvent,
} from './SessionMachine.types';
import { OrdskyService } from '../services/OrdskyService';
import { Cloud, WordCount } from '../../common/core/cloud.types';
import { logger } from '../../common/core/analytics';

const service = new OrdskyService();

const initialContext = { isAdmin: false, wordEntries: 0, id: '' };

export const sessionMachine = setup({
  types: {
    context: {} as SessionContext,
    events: {} as SessionEvent,
  },
  guards: {
    'Word is not empty': (context, event) =>
      (event as AddWordsEvent).words &&
      (event as AddWordsEvent).words.length > 0,
  },
  actions: {
    setAsAdmin: assign({ isAdmin: true }),
    // persistSession: (context) => {
    //   localStorage.setItem('session', JSON.stringify(context));
    // },
    // removeSession: () => {
    //   localStorage.removeItem('session');
    // },
    generateAndAddId: assign({
      id: () => generateId(),
    }),
    addToWordEntries: assign({
      wordEntries: (context, event) => (event as WordsAddedEvent).totalEntries,
    }),
    addCloudToContext: assign({
      cloud: ({ event }) => (event as CloudCreatedEvent).cloud,
      wordCount: ({ event }) => (event as CloudCreatedEvent).wordCount,
    }),
    addCreatedCloudToContext: assign({
      cloud: ({ event }) =>
        (event as unknown as { data: { cloud: Cloud[] } }).data.cloud,
      wordCount: ({ event }) =>
        (event as unknown as { data: { wordCount: WordCount } }).data.wordCount,
    }),
    restart: assign({
      id: '',
      isAdmin: false,
      wordEntries: 0,
    }),
    assignErrorMessage: assign({
      errorMessage: `Ingen økt med den id'en ble funnet.`,
    }),
    logJoined: () => {
      logger.logEvent('collab_joined');
    },
    logCreated: () => {
      logger.logEvent('collab_cloud_created');
    },
    logRejoined: () => {
      logger.logEvent('collab_rejoined');
    },
    logError: ({ context }) => {
      logger.logError({
        description: `Error in collabService. Message: ${context.errorMessage}`,
        fatal: false,
      });
    },
  },
  actors: {
    startSession: fromPromise<void, { id: string }>(async ({ input }) =>
      service.startSession(input.id)
    ),
    sendWords: fromPromise<void, { id: string; words: string[] }>(
      async ({ input }) => service.saveWords(input.id, input.words)
    ),
    listenToWords: fromCallback<EventObject, { id: string }>(
      ({ sendBack, input }) => {
        service.onWordsAdded(input.id, (totalEntries: number) =>
          sendBack({ type: 'WORDS_ADDED', totalEntries })
        );
      }
    ),
    listenForCloud: fromCallback<EventObject, { isAdmin: boolean; id: string }>(
      ({ sendBack, input }) => {
        if (input.isAdmin) return; // TODO: Should this be checked for elsewhere?. YES. USe guard!
        service.onCloudAdded(
          input.id,
          ({ cloud, wordCount }: { cloud: Cloud[]; wordCount: WordCount }) =>
            sendBack({ type: 'CLOUD_CREATED', cloud, wordCount })
        );
      }
    ),
    createCloud: fromPromise<
      {
        cloud: Cloud[];
        wordCount: WordCount;
      },
      { id: string }
    >(async ({ input }) => {
      const res = await service.createCloudFromStoredWordCounts(input.id);
      return res;
    }),
    endSession: fromPromise(async () => {
      service.endSession();
    }),
    checkSession: fromPromise<void, { id: string }>(({ input }) =>
      service.isLiveSession(input.id)
    ),
    rejoinSession: fromCallback<EventObject, { id: string }>(
      ({ sendBack, input }) => {
        // await service.isLiveSession(input.id); //TODO: Do check elsewherew!
        service.rejoinSession(input.id, (totalEntries: number) =>
          sendBack({ type: 'WORDS_ADDED', totalEntries })
        );
      }
    ),
  },
}).createMachine({
  id: 'session',
  context: initialContext,
  initial: 'idle',
  on: {
    RESTART: {
      target: '.idle',
      actions: ['restart'],
    },
  },
  states: {
    idle: {
      invoke: {
        id: 'reset',
        src: 'endSession',
      },
      on: {
        START_SESSION: {
          target: 'startSession',
          actions: ['setAsAdmin', 'generateAndAddId'],
        },
        JOIN_SESSION: {
          target: 'wordsInput',
          actions: assign({
            id: ({ event }) => event.id,
          }),
        },
        REJOIN_SESSION: {
          target: 'rejoining',
          actions: [
            assign({
              id: ({ event }) => event.id,
            }),
            'setAsAdmin',
          ],
        },
      },
    },
    startSession: {
      invoke: [
        {
          id: 'starSessionService',
          src: 'startSession',
          input: ({ context: { id } }) => ({ id }),
          onDone: 'waiting',
          onError: 'error',
        },
      ],
    },
    wordsInput: {
      invoke: {
        id: 'verifySession',
        src: 'checkSession',
        input: ({ context: { id } }) => ({ id }),
        onError: {
          target: 'error',
          actions: ['assignErrorMessage'],
        },
        onDone: {
          target: 'wordsInput',
          actions: ['logJoined'],
        },
      },
      on: {
        ADD_WORDS: {
          target: 'addWords',
          cond: 'Word is not empty',
        },
      },
    },
    addWords: {
      invoke: {
        id: 'addWordsService',
        src: 'sendWords',
        input: ({ context: { id }, event }) => ({
          id,
          words: (event as AddWordsEvent).words,
        }),
        onDone: 'waiting',
        onError: 'error',
      },
    },
    waiting: {
      invoke: [
        {
          id: 'wordsListener',
          src: 'listenToWords',
          input: ({ context: { id } }) => ({ id }),
          onDone: 'waiting',
        },
        {
          id: 'cloudListener',
          src: 'listenForCloud',
          input: ({ context: { id, isAdmin } }) => ({ id, isAdmin }),
          onDone: 'waiting',
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
    rejoining: {
      invoke: [
        {
          id: 'verifySession',
          src: 'checkSession',
          input: ({ context: { id } }) => ({ id }),
          onError: {
            target: 'idle',
          },
          onDone: {
            target: 'rejoining',
            actions: ['logRejoined'],
          },
        },
        {
          id: 'rejoinSession',
          src: 'rejoinSession',
          input: ({ context: { id } }) => ({ id }),
          onDone: 'waiting',
          onError: 'idle',
        },
      ],
      on: {
        WORDS_ADDED: {
          actions: ['addToWordEntries'],
        },
      },
    },
    creating: {
      invoke: {
        id: 'createCloud',
        src: 'createCloud',
        input: ({ context: { id } }) => ({ id }),
        onDone: {
          target: 'created',
          actions: ['addCreatedCloudToContext', 'logCreated'],
        },
        onError: 'error',
      },
      on: {
        CLOUD_CREATED: {
          target: 'created',
          actions: ['addCloudToContext'],
        },
      },
    },
    created: {
      invoke: {
        id: 'removeListeners',
        src: 'endSession',
        onDone: 'created',
      },
    },
    error: {
      entry: ['logError'],
    },
  },
});
