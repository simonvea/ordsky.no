import { Machine, assign } from 'xstate';
import { generateId } from './helpers';
import {
  JoinSessionEvent,
  AddWordsEvent,
  SessionContext,
  SessionEvent,
  SessionStateSchema,
  CloudCreatedEvent,
  WordsAddedEvent,
} from './StateMachine.types';
import { MockSessionService } from './mockSessionService';
import { Cloud } from '../../utils/cloud/cloud.types';

const service = new MockSessionService();

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
          onDone: {
            target: 'created',
            actions: assign({ cloud: (context, event) => event.data }),
          },
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
        },
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
        wordEntries: (context, event) =>
          (event as WordsAddedEvent).totalEntries,
      }),
      sendWords: (context, event) => {
        service.saveWords(context.id, (event as AddWordsEvent).words);
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
      listenToWords: (context) => (callback): void => {
        service.onWordsAdded(context.id, (totalEntries: number) =>
          callback({ type: 'WORDS_ADDED', totalEntries })
        );
      },
      listenForCloud: (context) => (callback) => {
        if (context.isAdmin) return; // TODO: Should this be checked for elsewhere?.
        service.onCloudAdded(context.id, (cloud: Cloud[]) =>
          callback({ type: 'CLOUD_CREATED', cloud })
        );
      },
      createCloud: (context) => async () => {
        const res = await service.createCloudFromStoredWordCounts(context.id);
        return res;
      },
      endSession: (context) => () => {
        service.endSession(context.id);
      },
    },
    /* eslint-enable unicorn/consistent-function-scoping */
  }
);
