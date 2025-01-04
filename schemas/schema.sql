DROP TABLE IF EXISTS sessions;

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  words TEXT, -- JSON
  cloud TEXT, -- JSON
  entries_count INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at_after_update
AFTER UPDATE ON sessions
FOR EACH ROW
BEGIN
  UPDATE sessions
  SET updated_at = datetime('now')
  WHERE id = OLD.id;
END;