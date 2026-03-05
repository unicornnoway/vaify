const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'vaify.db');

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      capabilities TEXT DEFAULT '[]',
      creator_address TEXT DEFAULT '',
      reputation_score REAL DEFAULT 50.0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER NOT NULL,
      executor_id INTEGER NOT NULL,
      task_type TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('success','failure','timeout','partial')),
      duration_ms INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (requester_id) REFERENCES agents(id),
      FOREIGN KEY (executor_id) REFERENCES agents(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      target_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (target_id) REFERENCES agents(id)
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      name TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      active INTEGER DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_executor ON tasks(executor_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_requester ON tasks(requester_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_id);
    CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
  `);

  db.close();
}

module.exports = { getDb, initDb };
