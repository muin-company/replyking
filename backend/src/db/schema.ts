import Database from 'better-sqlite3';
import path from 'path';

export const initDatabase = () => {
  const db = new Database(path.join(__dirname, '../../data/replyking.db'));
  
  // Instagram accounts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS instagram_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      access_token TEXT NOT NULL,
      token_expires_at INTEGER,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);

  // Comments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instagram_account_id INTEGER NOT NULL,
      comment_id TEXT UNIQUE NOT NULL,
      post_id TEXT NOT NULL,
      username TEXT NOT NULL,
      text TEXT NOT NULL,
      sentiment TEXT,
      sentiment_score REAL,
      timestamp INTEGER NOT NULL,
      is_replied BOOLEAN DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (instagram_account_id) REFERENCES instagram_accounts(id)
    )
  `);

  // Replies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER NOT NULL,
      reply_text TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      category TEXT,
      posted_at INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (comment_id) REFERENCES comments(id)
    )
  `);

  // Response templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instagram_account_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      template TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      usage_count INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (instagram_account_id) REFERENCES instagram_accounts(id)
    )
  `);

  // Analytics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instagram_account_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      comments_received INTEGER DEFAULT 0,
      replies_sent INTEGER DEFAULT 0,
      avg_response_time INTEGER,
      sentiment_positive INTEGER DEFAULT 0,
      sentiment_neutral INTEGER DEFAULT 0,
      sentiment_negative INTEGER DEFAULT 0,
      FOREIGN KEY (instagram_account_id) REFERENCES instagram_accounts(id),
      UNIQUE(instagram_account_id, date)
    )
  `);

  // Create indexes
  db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_account ON comments(instagram_account_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_comments_replied ON comments(is_replied)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_replies_status ON replies(status)`);

  return db;
};
