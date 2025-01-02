CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  words TEXT, -- JSON
  cloud_svg TEXT,
  entries_count INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
