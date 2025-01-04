export type SessionResponse = {
  id: string;
  words: string[];
  cloud?: string;
  numberOfEntries: number;
  createdAt: string;
  updatedAt: string;
};

export type DbSession = {
  id: string;
  words: string;
  cloud?: string;
  entries_count: number;
  created_at: string;
  updated_at: string;
};
