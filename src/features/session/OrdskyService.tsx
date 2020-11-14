import { SessionsService } from '../../services/interfaces/SessionsService';
import { Cloud } from '../../utils/cloud/cloud.types';
import { wordCountToCloudInput } from '../../utils/cloud/wordCountToCloudInput';
import { generateCloud } from '../../utils/cloud/createCloud';
import { WordCount } from '../../utils/countWords';

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

  async createCloudFromStoredWordCounts(id: string): Promise<Cloud[]> {
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

    const sortedWordCount = wordCount.sort((a, b) => b.count - a.count);

    const cloudInput = wordCountToCloudInput(sortedWordCount);

    const cloud = await new Promise<Cloud[]>((resolve) => {
      const callback = (data: Cloud[]): void => {
        resolve(data);
      };

      generateCloud(cloudInput, callback);
    });

    // Send to backend
    this.socket.send(
      JSON.stringify({
        action: 'savecloud',
        id: id.toUpperCase(),
        cloud,
      })
    );

    return cloud;
  }

  public onCloudAdded(id: string, callback: (cloud: Cloud[]) => void): void {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'CLOUD_CREATED') {
        callback(data.cloud);
      }
    });
  }
}
