import { SessionsService } from '../../services/interfaces/SessionsService';
import { Cloud } from '../../utils/cloud/cloud.types';

export class MockSessionService implements SessionsService {
  constructor() {
    const id = setInterval(() => {
      if (this.wordsListener) this.wordsListener();
    }, 2000);
    this.mockCounter = () => clearInterval(id);
  }

  private mockCounter: () => void;

  private mockCloudCreater(): void {
    setTimeout(() => {
      if (this.cloudsListener) this.cloudsListener(this.cloud);
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

  private wordsListener?: () => void;

  private cloudsListener?: (cloud: Cloud[]) => void;

  async saveWords(id: string, words: string[]): Promise<void> {
    this.words.push(...words);
    this.mockCloudCreater();
    return Promise.resolve();
  }

  onWordsAdded(id: string, callback: () => void): void {
    this.wordsListener = callback;
  }

  async createCloudFromStoredWordCounts(id: string): Promise<Cloud[]> {
    const cloud = await new Promise<Cloud[]>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.cloud);
      }, 3000);
    });
    return cloud;
  }

  onCloudAdded(id: string, callback: (cloud: Cloud[]) => void): void {
    this.cloudsListener = callback;
  }

  endSession(id: string): void {
    this.wordsListener = undefined;
    this.cloudsListener = undefined;
    this.mockCounter();
  }
}
