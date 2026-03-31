-- ============================================================
-- AgriSense AI - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- Project: https://jochdexnhwisqkklbeua.supabase.co
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'Farmer',
  organization TEXT,
  location TEXT DEFAULT 'Verdant Valley Research Hub',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agronomist'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Farmer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- DIAGNOSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  disease_name TEXT NOT NULL,
  severity TEXT DEFAULT 'Moderate' CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
  confidence FLOAT DEFAULT 0.85,
  crop_type TEXT,
  description TEXT,
  query TEXT,
  image_url TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created_at ON diagnoses(created_at DESC);

-- ============================================================
-- FORUM POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  author_role TEXT DEFAULT 'Farmer',
  upvotes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_upvotes ON forum_posts(upvotes DESC);

-- ============================================================
-- RESEARCH PAPERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS research_papers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT,
  year INTEGER,
  tags TEXT[] DEFAULT '{}',
  journal TEXT,
  doi TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some sample papers
INSERT INTO research_papers (title, abstract, authors, year, tags) VALUES
  ('Biocontrol Agents for Fusarium Wilt Management in Tomato', 
   'Evaluation of Trichoderma harzianum and Bacillus subtilis as antagonists against Fusarium oxysporum f.sp. lycopersici in greenhouse and field conditions.',
   'Singh & Kumar', 2024, ARRAY['Biocontrol','Tomato','Root Rot']),
  ('Machine Learning Models for Early Detection of Cassava Mosaic Disease',
   'Comparative analysis of ResNet-50, EfficientNet, and Vision Transformers for cassava disease classification using smartphone images from Uganda and Tanzania.',
   'Okello et al.', 2024, ARRAY['AI Analysis','Cassava','Virus']),
  ('Integrated Pest Management in Smallholder Rice Farming',
   'Economic and environmental analysis of IPM adoption in 500 smallholder farms across Vietnam, Philippines, and Bangladesh.',
   'Nguyen & Santos', 2023, ARRAY['IPM','Rice','Blast'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAVED PAPERS TABLE (user bookmarks)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_papers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paper_id UUID REFERENCES research_papers(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, paper_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Diagnoses
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own diagnoses" ON diagnoses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diagnoses" ON diagnoses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own diagnoses" ON diagnoses FOR DELETE USING (auth.uid() = user_id);

-- Forum Posts (public read, authenticated write)
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view forum posts" ON forum_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can post" ON forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can upvote posts" ON forum_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Research Papers (public read)
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view papers" ON research_papers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert papers" ON research_papers FOR INSERT TO authenticated WITH CHECK (true);

-- Saved Papers
ALTER TABLE saved_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own bookmarks" ON saved_papers FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
