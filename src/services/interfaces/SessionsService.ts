import { Cloud } from '../../utils/cloud/cloud.types';

export interface SessionsService {
  /**
   * Saves words to storage
   */
  saveWords: (id: string, words: string[]) => Promise<void>;

  /**
   * Gets all word counts from storage and
   * creates a word cloud, also saves it back to storage
   */
  createCloudFromStoredWordCounts: (id: string) => Promise<Cloud[]>;

  /**
   * Runs callback whenever words are added
   */
  onWordsAdded: (id: string, callback: (totalEntries: number) => void) => void;

  /**
   * Runs callback when cloud is found in storage
   *
   * @param callback callback to run when cloud is found in storage
   */
  onCloudAdded: (id: string, callback: (cloud: Cloud[]) => void) => void;

  /**
   * Unsubscribes listeners
   */
  endSession: (id: string) => void;
}
