import { Cloud, WordCount } from '../common/core/cloud.types';
import { createCloud } from '../common/core/createCloud';
import { wordCountToCloudInput } from '../common/core/wordCountToCloudInput';
import { SessionsService } from './SessionsService';

export class OrdskyService implements SessionsService {
  private endpoint = 'wss://api.ordsky.no';

  private socket!: WebSocket;

  public startSession(id: string): void {
    this.socket = new WebSocket(this.endpoint);
    this.socket.addEventListener('open', () => {
      this.socket.send(
        JSON.stringify({
          id: id.toUpperCase(),
          action: 'startsession',
        })
      );
    });
  }

  private restApiUrl =
    'https://s4wsje5xxj.execute-api.eu-north-1.amazonaws.com/prod';

  public async isLiveSession(id: string): Promise<void> {
    const response = await fetch(`${this.restApiUrl}/${id}`);

    if (response.ok) {
      const data = await response.json();
      if (data.Item && !data.Item.cloud) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Item does not exist'));
    }
    return Promise.reject(new Error(response.status.toString()));
  }

  public endSession(): void {
    if (this.socket) this.socket.close();
  }

  async saveWords(id: string, words: string[]): Promise<void> {
    this.socket = new WebSocket(this.endpoint);

    this.socket.addEventListener('open', () => {
      this.socket.send(
        JSON.stringify({
          action: 'savewords',
          id: id.toUpperCase(),
          words,
        })
      );
    });
  }

  onWordsAdded(id: string, callback: (totalEntries: number) => void): void {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'WORDS_ADDED') {
        callback(data.numberOfEntries);
      }
    });
  }

  async createCloudFromStoredWordCounts(
    id: string
  ): Promise<{ cloud: Cloud[]; wordCount: WordCount }> {
    const wordsPromise = new Promise<string[]>((resolve, reject) => {
      const error = setTimeout(
        () => reject(new Error('Did not get a response in time')),
        8000
      );
      this.socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'GET_WORDS') {
          clearTimeout(error);
          resolve(data.words);
        }
      });
      this.socket.send(
        JSON.stringify({
          action: 'getwords',
          id: id.toUpperCase(),
        })
      );
    });

    const words = await wordsPromise;

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

    const cloudInput = wordCountToCloudInput(wordCount);

    const cloud = await createCloud(cloudInput);

    // Send to backend
    this.socket.send(
      JSON.stringify({
        action: 'savecloud',
        id: id.toUpperCase(),
        cloud,
        wordCount,
      })
    );

    return { cloud, wordCount };
  }

  public onCloudAdded(
    id: string,
    callback: (params: { cloud: Cloud[]; wordCount: WordCount }) => void
  ): void {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'CLOUD_CREATED') {
        callback({ cloud: data.cloud, wordCount: data.wordCount });
      }
    });
  }
}
