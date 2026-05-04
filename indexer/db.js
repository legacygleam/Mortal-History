import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'eternal-life.db');

let db;

export function initDB(dbPath = DB_PATH) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      tx_id TEXT PRIMARY KEY,
      author_did TEXT NOT NULL,
      nickname TEXT,
      real_name TEXT,
      birth_year INTEGER,
      death_year INTEGER,
      nationality TEXT,
      language TEXT DEFAULT 'zh',
      title TEXT,
      bio TEXT,
      created_at INTEGER,
      indexed_at TEXT DEFAULT (datetime('now')),
      moderated INTEGER DEFAULT 0,
      moderated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS contents (
      tx_id TEXT PRIMARY KEY,
      author_did TEXT NOT NULL,
      parent_tx_id TEXT,
      file_type TEXT NOT NULL,
      title TEXT,
      language TEXT DEFAULT 'zh',
      summary TEXT,
      created_at INTEGER,
      indexed_at TEXT DEFAULT (datetime('now')),
      moderated INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS moderation_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_id TEXT NOT NULL,
      action TEXT NOT NULL,
      reason TEXT,
      moderator TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);
    CREATE INDEX IF NOT EXISTS idx_profiles_nationality ON profiles(nationality);
    CREATE INDEX IF NOT EXISTS idx_profiles_indexed_at ON profiles(indexed_at);
    CREATE INDEX IF NOT EXISTS idx_contents_file_type ON contents(file_type);
  `);

  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
}

export function insertProfile(profile) {
  const stmt = getDB().prepare(`
    INSERT OR REPLACE INTO profiles (tx_id, author_did, nickname, real_name, birth_year, death_year, nationality, language, title, bio, created_at)
    VALUES (@tx_id, @author_did, @nickname, @real_name, @birth_year, @death_year, @nationality, @language, @title, @bio, @created_at)
  `);
  return stmt.run(profile);
}

export function insertContent(content) {
  const stmt = getDB().prepare(`
    INSERT OR REPLACE INTO contents (tx_id, author_did, parent_tx_id, file_type, title, language, summary, created_at)
    VALUES (@tx_id, @author_did, @parent_tx_id, @file_type, @title, @language, @summary, @created_at)
  `);
  return stmt.run(content);
}

export function searchProfiles(query, limit = 20) {
  const stmt = getDB().prepare(`
    SELECT * FROM profiles
    WHERE moderated = 0
      AND (nickname LIKE @query OR real_name LIKE @query OR nationality LIKE @query OR bio LIKE @query)
    ORDER BY indexed_at DESC
    LIMIT @limit
  `);
  return stmt.all({ query: `%${query}%`, limit });
}

export function getRecentProfiles(limit = 20) {
  const stmt = getDB().prepare(`
    SELECT * FROM profiles
    WHERE moderated = 0
    ORDER BY indexed_at DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function getRandomProfile() {
  const stmt = getDB().prepare(`
    SELECT * FROM profiles
    WHERE moderated = 0
    ORDER BY RANDOM()
    LIMIT 1
  `);
  return stmt.get();
}
