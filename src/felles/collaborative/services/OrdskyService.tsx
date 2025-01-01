import { Cloud, WordCount } from '../../../common/core/cloud.types';
import { createCloud } from '../../../common/core/createCloud';
import { wordCountToCloudInput } from '../../../common/core/wordCountToCloudInput';
import { SessionService, SessionEvents } from './SessionsService';

export class OrdskyService implements SessionService {
  private restApiUrl = '';
  private socketUrl = '';

  private static instance: OrdskyService;
  private socket?: WebSocket;

  constructor(restUrl: string, socketUrl: string) {
    this.restApiUrl = restUrl;
    this.socketUrl = socketUrl;
  }

  public static getInstance(
    restUrl?: string,
    socketUrl?: string
  ): OrdskyService {
    if (!OrdskyService.instance && restUrl && socketUrl) {
      OrdskyService.instance = new OrdskyService(restUrl, socketUrl);
    }
    return OrdskyService.instance;
  }

  socketIsOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN || false;
  }

  openSocket(onOpen?: (service: OrdskyService) => void): void {
    if (this.socketIsOpen()) {
      console.log('Socket is already open');
      onOpen?.(this);
      return;
    }

    this.socket = new WebSocket(this.socketUrl);
    this.socket.addEventListener('open', () => {
      onOpen?.(this);
    });
  }

  closeSocket(): void {
    this.socket?.close();
  }

  subscribe(callback: (event: SessionEvents) => void): void {
    if (!this.socketIsOpen()) {
      throw new Error('Socket is not open');
    }

    this.socket?.addEventListener('message', (message) => {
      const event = JSON.parse(message.data);

      callback(event);
    });
  }

  startSession(id: string): void {
    if (!this.socketIsOpen()) {
      throw new Error('Socket is not open');
    }

    this.socket?.send(
      JSON.stringify({
        id,
        action: 'startsession',
      })
    );
  }

  joinSession(id: string): void {
    if (!this.socketIsOpen()) {
      throw new Error('Socket is not open');
    }

    this.socket?.send(
      JSON.stringify({
        id: id.toUpperCase(),
        action: 'joinsession',
      })
    );
  }

  public async isLiveSession(id: string): Promise<boolean> {
    const response = await fetch(`${this.restApiUrl}/${id}`);

    if (response.ok) {
      const data = await response.json();

      if (data.Item && !data.Item.cloud) {
        return true;
      }
      return false;
    }
    throw new Error(response.status.toString());
  }

  saveWords({ id, words }: { id: string; words: string[] }): void {
    if (!this.socketIsOpen()) {
      throw new Error('Socket is not open');
    }

    this.socket?.send(
      JSON.stringify({
        action: 'savewords',
        id: id.toUpperCase(),
        words,
      })
    );
  }

  async getAllWords(id: string): Promise<string[]> {
    const response = await fetch(`${this.restApiUrl}/${id}`);

    if (response.ok) {
      const { Item } = await response.json();

      if (!Item) {
        throw new Error('No session found');
      }

      return Item.words.L.map((word: { S: string }) => word.S);
    }
    throw new Error(response.status.toString());
  }

  async createCloud(
    words: string[]
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
    if (!this.socketIsOpen()) {
      throw new Error('Socket is not open');
    }

    // To save WriteCapacity we only send top 10 words.
    const sortedWordCount = wordCount.sort((a, b) => b.count - a.count);
    const wordCountToSend = sortedWordCount.slice(0, 10);

    this.socket?.send(
      JSON.stringify({
        action: 'savecloud',
        id: id.toUpperCase(),
        cloud,
        wordCount: wordCountToSend,
      })
    );
  }
}
