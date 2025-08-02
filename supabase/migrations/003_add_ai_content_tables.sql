-- Voice clips table
CREATE TABLE IF NOT EXISTS voice_clips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id),
  text_content TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  voice_type TEXT NOT NULL,
  personality TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fighter portraits table
CREATE TABLE IF NOT EXISTS fighter_portraits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id),
  portrait_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Match commentary table
CREATE TABLE IF NOT EXISTS match_commentary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id),
  commentary_text TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  commentary_style TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns to matches table for commentary
ALTER TABLE matches
ADD COLUMN IF NOT EXISTS commentary_url TEXT,
ADD COLUMN IF NOT EXISTS commentary_text TEXT;
