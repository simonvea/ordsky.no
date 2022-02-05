import { SessionsService } from './SessionsService';
import { WordCount, Cloud } from '../common/core/cloud.types';

export class MockSessionService implements SessionsService {
  private startMockCounter(): void {
    const id = setInterval(() => {
      this.numberOfEntries += 1;
      if (this.wordsListener) this.wordsListener(this.numberOfEntries);
    }, 2000);
    this.mockCounter = () => clearInterval(id);
  }

  private numberOfEntries = 0;

  private mockCounter: () => void = () => {};

  private mockCloudCreater(): void {
    setTimeout(() => {
      if (this.cloudsListener)
        this.cloudsListener({ cloud: this.cloud, wordCount: this.wordCount });
    }, 6000);
  }

  private words: string[] = [];

  private cloud: Cloud[] = [
    {
      fill: '#e58c69',
      font: 'Impact',
      hasText: true,
      height: 40,
      padding: 2,
      rotate: 0,
      size: 20,
      style: 'normal',
      text: 'DIALEKT',
      weight: 'normal',
      width: 128,
      x: 116,
      x0: -64,
      x1: 64,
      xoff: 0,
      y: 72,
      y0: -17,
      y1: 19,
      yoff: 0,
    },
    {
      fill: '#370cf7',
      font: 'Impact',
      hasText: true,
      height: 40,
      padding: 2,
      rotate: 0,
      size: 20,
      style: 'normal',
      text: 'TILHØRIGHET',
      weight: 'normal',
      width: 160,
      x: 95,
      x0: -80,
      x1: 80,
      xoff: 128,
      y: 37,
      y0: -18,
      y1: 19,
      yoff: 0,
    },
  ];

  private wordCount: WordCount = [
    { text: 'hello', count: 2 },
    { text: 'world', count: 5 },
  ];

  private wordsListener?: (totalEntries: number) => void;

  private cloudsListener?: (cparams: {
    cloud: Cloud[];
    wordCount: WordCount;
  }) => void;

  async saveWords(id: string, words: string[]): Promise<void> {
    this.words.push(...words);
    this.mockCloudCreater();
    
  }

  onWordsAdded(id: string, callback: (totalEntries: number) => void): void {
    this.startMockCounter();
    this.wordsListener = callback;
  }

  async createCloudFromStoredWordCounts(): Promise<{
    cloud: Cloud[];
    wordCount: WordCount;
  }> {
    const cloud = await new Promise<Cloud[]>((resolve) => {
      setTimeout(() => {
        resolve(this.cloud);
      }, 3000);
    });
    return { cloud, wordCount: this.wordCount };
  }

  onCloudAdded(
    id: string,
    callback: (params: { cloud: Cloud[]; wordCount: WordCount }) => void
  ): void {
    this.cloudsListener = callback;
  }

  endSession(): void {
    this.wordsListener = undefined;
    this.cloudsListener = undefined;
    this.mockCounter();
    this.numberOfEntries = 0;
  }
}
