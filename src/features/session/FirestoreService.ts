import { Cloud } from '../../utils/cloud/cloud.types';
import { SessionsService } from '../../services/interfaces/SessionsService';
import { WordCount } from '../../utils/countWords';
import { wordCountToCloudInput } from '../../utils/cloud/wordCountToCloudInput';
import { generateCloud } from '../../utils/cloud/createCloud';

export class FirestoreSession implements SessionsService {
  constructor(private storage: firebase.firestore.Firestore) {}

  private baseCollection = 'sessions';

  private wordsCollection = 'words';

  public endSession(): void {
    this.listeners.forEach((listener) => listener());
  }

  private listeners: Array<() => void> = [];

  async saveWords(id: string, words: string[]): Promise<void> {
    return this.storage
      .collection(this.baseCollection)
      .doc(id)
      .collection(this.wordsCollection)
      .doc()
      .set({ words });
  }

  onWordsAdded(id: string, callback: (totalEntries: number) => void): void {
    const stopListening = this.storage
      .collection(this.baseCollection)
      .doc(id)
      .collection(this.wordsCollection)
      .onSnapshot((snapshot) => {
        const entries = snapshot.docs.length;
        callback(entries);
      });

    this.listeners.push(stopListening);
  }

  async createCloudFromStoredWordCounts(id: string): Promise<Cloud[]> {
    const collection = await this.storage
      .collection(this.baseCollection)
      .doc(id)
      .collection(this.wordsCollection)
      .get();
    const { docs } = collection;

    const counted = new Set();
    let wordCount: WordCount = [];

    type Doc = {
      words: string[];
    };

    docs.forEach((doc) => {
      const data = doc.data();
      (data as Doc).words.forEach((word) => {
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
    await this.storage.collection(this.baseCollection).doc(id).update({
      cloud,
    });

    return cloud;
  }

  public onCloudAdded(id: string, callback: (cloud: Cloud[]) => void): void {
    const stopListening = this.storage
      .collection(this.baseCollection)
      .doc(id)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data?.cloud) {
          callback(data.cloud);
        }
      });

    this.listeners.push(stopListening);
  }
}
