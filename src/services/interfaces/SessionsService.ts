import { Cloud } from '../../utils/cloud/cloud.types';
import { WordCount } from '../../utils/countWords';

export interface SessionsService {
  /**
   * Saves words to storage
   */
  saveWordCount: (words: WordCount) => Promise<void>;

  /**
   * Gets all word counts from storage and
   * creates a word cloud
   */
  createCloudFromStoredWordCounts: () => Promise<Cloud>;

  /**
   * Saves word cloud to storage
   */
  saveCloud: (cloud: Cloud) => Promise<void>;

  /**
   * Receives a callback function that will be run
   * whenever the related storage changes.
   * The callback will receive the new snapshot of storage
   */
  onStorageChange: (cb: (snapshot: unknown) => void) => void;

  /**
   * Unsubscribes the storage listener
   */
  endSession?: () => void;
}
