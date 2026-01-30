-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'finished')),
  current_round INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  finished_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 hour'
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  session_id TEXT,
  score INT DEFAULT 0,
  position INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rounds table
CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  round_number INT NOT NULL,
  dice_values INT[] DEFAULT ARRAY[1,1,1,1,1,1],
  combination TEXT DEFAULT 'Nic',
  score_gained INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard stats table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_name TEXT UNIQUE NOT NULL,
  total_games INT DEFAULT 0,
  total_wins INT DEFAULT 0,
  total_losses INT DEFAULT 0,
  average_score DECIMAL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_code ON games(code);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_players_game ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_rounds_game ON rounds(game_id);
CREATE INDEX IF NOT EXISTS idx_rounds_player ON rounds(player_id);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public access (no authentication needed)
CREATE POLICY "allow_public_read_games" ON games FOR SELECT USING (true);
CREATE POLICY "allow_public_insert_games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_public_update_games" ON games FOR UPDATE USING (true);

CREATE POLICY "allow_public_read_players" ON players FOR SELECT USING (true);
CREATE POLICY "allow_public_insert_players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_public_update_players" ON players FOR UPDATE USING (true);

CREATE POLICY "allow_public_read_rounds" ON rounds FOR SELECT USING (true);
CREATE POLICY "allow_public_insert_rounds" ON rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_public_update_rounds" ON rounds FOR UPDATE USING (true);

CREATE POLICY "allow_public_read_leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "allow_public_update_leaderboard" ON leaderboard FOR UPDATE USING (true);

-- Function to cleanup expired games
CREATE OR REPLACE FUNCTION cleanup_expired_games()
RETURNS void AS $$
BEGIN
  DELETE FROM games WHERE status = 'finished' AND finished_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;
