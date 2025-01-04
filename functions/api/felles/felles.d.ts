export type SessionResponse = {
  id: string;
  words: string[];
  numberOfEntries: number;
  cloud?: string;
  wordCount?: { text: string; count: number }[];
  createdAt: string;
  updatedAt: string;
};

export type DbSession = {
  id: string;
  words: string;
  entries_count: number;
  cloud?: string;
  word_count?: string;
  created_at: string;
  updated_at: string;
};
