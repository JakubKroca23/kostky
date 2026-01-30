import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      total_score INTEGER DEFAULT 0,
      avg_score REAL DEFAULT 0,
      is_ai BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_code TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'lobby',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS game_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      rank INTEGER,
      FOREIGN KEY(game_id) REFERENCES games(id),
      FOREIGN KEY(player_id) REFERENCES players(id)
    );

    CREATE TABLE IF NOT EXISTS rounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      round_number INTEGER NOT NULL,
      current_player_id INTEGER,
      FOREIGN KEY(game_id) REFERENCES games(id),
      FOREIGN KEY(current_player_id) REFERENCES players(id)
    );

    CREATE TABLE IF NOT EXISTS rolls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      round_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      dice_values TEXT NOT NULL,
      score INTEGER,
      combination TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(round_id) REFERENCES rounds(id),
      FOREIGN KEY(player_id) REFERENCES players(id)
    );
  `);
}

export default db;
