import { assign, createMachine } from "xstate";
import { generateId } from "../helpers";
import {
  JoinSessionEvent,
  AddWordsEvent,
  SessionContext,
  SessionEvent,
  SessionTypestate,
  CloudCreatedEvent,
  WordsAddedEvent,
} from "./StateMachine.types";
import { OrdskyService } from "../services/OrdskyService";
import { Cloud, WordCount } from "../../common/core/cloud.types";
import { logger } from "../../common/core/analytics";

const service = new OrdskyService();

export const sessionMachine = createMachine<
  SessionContext,
  SessionEvent,
  SessionTypestate
>(
  {
    id: "session",
    context: { isAdmin: false, wordEntries: 0, id: "" },
    initial: "idle",
    on: {
      RESTART: {
        target: "idle",
        actions: ["restart"],
      },
    },
    states: {
      idle: {
        invoke: {
          id: "reset",
          src: "endSession",
        },
        on: {
          START_SESSION: {
            target: "startSession",
            actions: ["setAsAdmin", "generateAndAddId"],
          },
          JOIN_SESSION: {
            target: "wordsInput",
            actions: ["addId"],
          },
        },
      },
      startSession: {
        invoke: [
          {
            id: "starSessionService",
            src: "startSession",
            onDone: "waiting",
            onError: "error",
          },
        ],
      },
      wordsInput: {
        invoke: {
          id: "verifySession",
          src: "checkSession",
          onError: {
            target: "error",
            actions: ["assignErrorMessage"],
          },
          onDone: {
            actions: ["logJoined"],
          },
        },
        on: {
          ADD_WORDS: {
            target: "addWords",
            cond: "Word is not empty",
          },
        },
      },
      addWords: {
        invoke: {
          id: "addWordsService",
          src: "sendWords",
          onDone: "waiting",
          onError: "error",
        },
      },
      waiting: {
        invoke: [
          {
            id: "wordsListener",
            src: "listenToWords",
          },
          {
            id: "cloudListener",
            src: "listenForCloud",
          },
        ],
        on: {
          WORDS_ADDED: {
            actions: ["addToWordEntries"],
          },
          CREATE_CLOUD: "creating",
          CLOUD_CREATED: {
            target: "created",
            actions: ["addCloudToContext"],
          },
        },
      },
      creating: {
        invoke: {
          id: "createCloud",
          src: "createCloud",
          onDone: {
            target: "created",
            actions: ["addCreatedCloudToContext", "logCreated"],
          },
          onError: "error",
        },
        on: {
          CLOUD_CREATED: {
            target: "created",
            actions: ["addCloudToContext"],
          },
        },
      },
      created: {
        invoke: {
          id: "removeListeners",
          src: "endSession",
        },
      },
      error: {
        entry: ["logError"],
      },
    },
  },
  {
    guards: {
      "Word is not empty": (context, event) =>
        (event as AddWordsEvent).words &&
        (event as AddWordsEvent).words.length > 0,
    },
    actions: {
      setAsAdmin: assign<SessionContext, SessionEvent>({ isAdmin: true }),
      generateAndAddId: assign<SessionContext, SessionEvent>({
        id: () => generateId(),
      }),
      addId: assign<SessionContext, SessionEvent>({
        id: (context, event) => (event as JoinSessionEvent).id,
      }),
      addToWordEntries: assign<SessionContext, SessionEvent>({
        wordEntries: (context, event) =>
          (event as WordsAddedEvent).totalEntries,
      }),
      addCloudToContext: assign<SessionContext, SessionEvent>({
        cloud: (context, event) => (event as CloudCreatedEvent).cloud,
        wordCount: (context, event) => (event as CloudCreatedEvent).wordCount,
      }),
      addCreatedCloudToContext: assign({
        cloud: (context, event) =>
          (event as unknown as { data: { cloud: Cloud[] } }).data.cloud,
        wordCount: (context, event) =>
          (event as unknown as { data: { wordCount: WordCount } }).data
            .wordCount,
      }),
      restart: assign<SessionContext, SessionEvent>({
        id: "",
        isAdmin: false,
        wordEntries: 0,
      }),
      assignErrorMessage: assign<SessionContext, SessionEvent>({
        errorMessage: `Ingen økt med den id'en ble funnet.`,
      }),
      logJoined: () => {
        logger.logEvent("collab_joined");
      },
      logCreated: () => {
        logger.logEvent("collab_cloud_created");
      },
      logError: (context) => {
        logger.logError({
          description: `Error in collabService. Message: ${context.errorMessage}`,
          fatal: false,
        });
      },
    },
    /* eslint-disable unicorn/consistent-function-scoping */
    services: {
      startSession: async (context) => {
        service.startSession(context.id);
      },
      sendWords: (context, event) =>
        service.saveWords(context.id, (event as AddWordsEvent).words),
      listenToWords:
        (context) =>
        (callback): void => {
          service.onWordsAdded(context.id, (totalEntries: number) =>
            callback({ type: "WORDS_ADDED", totalEntries })
          );
        },
      listenForCloud: (context) => (callback) => {
        if (context.isAdmin) return; // TODO: Should this be checked for elsewhere?.
        service.onCloudAdded(
          context.id,
          ({ cloud, wordCount }: { cloud: Cloud[]; wordCount: WordCount }) =>
            callback({ type: "CLOUD_CREATED", cloud, wordCount })
        );
      },
      createCloud: (context) => async () => {
        const res = await service.createCloudFromStoredWordCounts(context.id);
        return res;
      },
      endSession: () => () => {
        service.endSession();
      },
      checkSession: (context) => service.isLiveSession(context.id),
    },
    /* eslint-enable unicorn/consistent-function-scoping */
  }
);
