import { WordCount, Cloud } from "../../common/core/cloud.types";

export interface SessionsService {
  /**
   * Saves words to storage
   */
  saveWords: (id: string, words: string[]) => Promise<void>;

  /**
   * Gets all word counts from storage and
   * creates a word cloud, also saves it back to storage
   */
  createCloudFromStoredWordCounts: (
    id: string
  ) => Promise<{ cloud: Cloud[]; wordCount: WordCount }>;

  /**
   * Runs callback whenever words are added
   */
  onWordsAdded: (id: string, callback: (totalEntries: number) => void) => void;

  /**
   * Runs callback when cloud is found in storage
   *
   * @param callback callback to run when cloud is found in storage
   */
  onCloudAdded: (
    id: string,
    callback: (params: { cloud: Cloud[]; wordCount: WordCount }) => void
  ) => void;

  /**
   * Unsubscribes listeners
   */
  endSession: (id: string) => void;

  // joinSession: (id: string) => Promise<void>;
}
