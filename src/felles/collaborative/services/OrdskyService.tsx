import { Cloud, WordCount } from "../../../common/core/cloud.types";
import { createCloud } from "../../../common/core/createCloud";
import { wordCountToCloudInput } from "../../../common/core/wordCountToCloudInput";
import {
  SessionService,
  SessionEvents,
  WordsAddedEvent,
  CloudCreatedEvent,
} from "./SessionsService";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export interface ServerToClientEvents {
  WORDS_ADDED: (response: WordsAddedEvent) => void;
  CLOUD_CREATED: (response: CloudCreatedEvent) => void;
  ERROR: (response: ErrorEvent) => void;
  // SESSION_STARTED: (response: SessionWordsResponse) => void;
  // SESSION_JOINED: (response: SessionJoinedResponse) => void;
  // USER_JOINED: (response: UserJoinedResponse) => void;
}

export interface ClientToServerEvents {
  startsession: (message: { id: string }) => void;
  savewords: (message: { id: string; words: string[] }) => void;
  getwords: (message: { id: string }) => void;
  savecloud: (message: {
    id: string;
    cloud: Cloud[];
    wordCount: WordCount;
  }) => void;
  joinsession: (message: { id: string }) => void;
}

export class OrdskyService implements SessionService {
  private restApiUrl = "";
  private socketUrl = "";
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  private subscribers: ((event: SessionEvents) => void)[] = [];

  constructor(restUrl: string, socketUrl: string) {
    this.restApiUrl = restUrl;
    this.socketUrl = socketUrl;
    this.socket = io({ path: socketUrl, transports: ["websocket"] });
    console.log("Starting socket on url", socketUrl);
    this.socket.onAny((_eventName, data) => {
      this.subscribers.forEach((s) => s(data));
    });
  }

  subscribe(callback: (event: SessionEvents) => void): void {
    this.subscribers.push(callback);
  }

  startSession(id: string): void {
    this.socket.emit("startsession", {
      id: id.toUpperCase(),
    });
  }

  joinSession(id: string): void {
    console.log("HELLO FROM JOINSESSION");
    this.socket.emit("joinsession", {
      id: id.toUpperCase(),
    });
  }

  public async isLiveSession(id: string): Promise<boolean> {
    const collaborativeApiUrl = this.restApiUrl;
    const response = await fetch(`${collaborativeApiUrl}/${id.toUpperCase()}`);

    if (response.ok) {
      const data: { cloud?: Cloud } = await response.json();

      if (data && !data.cloud) {
        return true;
      }
      return false;
    }
    throw new Error(response.status.toString());
  }

  saveWords({ id, words }: { id: string; words: string[] }): void {
    this.socket.emit("savewords", {
      id: id.toUpperCase(),
      words,
    });
  }

  async getAllWords(id: string): Promise<string[]> {
    const collaborativeApiUrl = this.restApiUrl;
    const response = await fetch(`${collaborativeApiUrl}/${id.toUpperCase()}`);

    if (response.ok) {
      const data: { words: string[] } = await response.json();

      if (!data) {
        throw new Error("No session found");
      }

      return data.words || [];
    }
    throw new Error(response.status.toString());
  }

  async createCloud(
    words: string[],
  ): Promise<{ cloud: Cloud[]; wordCount: WordCount }> {
    const counted = new Set();
    let wordCount: WordCount = [];

    words.forEach((w) => {
      const word = w.toUpperCase();

      if (counted.has(word)) {
        wordCount = wordCount.map((count) => ({
          text: count.text,
          count: count.text === word ? count.count + 1 : count.count,
        }));
      } else {
        wordCount.push({
          text: word,
          count: 1,
        });
        counted.add(word);
      }
    });

    const sortedWordCount = wordCount.sort((a, b) => b.count - a.count);

    const cloudInput = wordCountToCloudInput(sortedWordCount);

    const cloud = await createCloud(cloudInput);

    return { cloud, wordCount };
  }

  saveCloudAndWordCount({
    id,
    cloud,
    wordCount,
  }: {
    id: string;
    cloud: Cloud[];
    wordCount: WordCount;
  }): void {
    const sortedWordCount = wordCount.sort((a, b) => b.count - a.count);

    this.socket.emit("savecloud", {
      id: id.toUpperCase(),
      cloud,
      wordCount: sortedWordCount,
    });
  }
}
