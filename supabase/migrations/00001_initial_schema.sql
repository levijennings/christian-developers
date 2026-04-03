-- Christian Developers: Initial Schema Migration
-- Production-ready PostgreSQL/Supabase schema
-- Created: 2026-04-03

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";


-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profile for new auth user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update forum post reply count
CREATE OR REPLACE FUNCTION update_forum_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts
    SET reply_count = reply_count + 1,
        updated_at = NOW()
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts
    SET reply_count = GREATEST(reply_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update forum category post count
CREATE OR REPLACE FUNCTION update_forum_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_categories
    SET post_count = post_count + 1
    WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_categories
    SET post_count = GREATEST(post_count - 1, 0)
    WHERE id = OLD.category_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update prayer request prayer count
CREATE OR REPLACE FUNCTION update_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prayer_requests
    SET prayer_count = prayer_count + 1,
        updated_at = NOW()
    WHERE id = NEW.request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prayer_requests
    SET prayer_count = GREATEST(prayer_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.request_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update upvote counts on posts and replies
CREATE OR REPLACE FUNCTION update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'post' THEN
      UPDATE forum_posts
      SET upvotes = upvotes + 1,
          updated_at = NOW()
      WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'reply' THEN
      UPDATE forum_replies
      SET upvotes = upvotes + 1,
          updated_at = NOW()
      WHERE id = NEW.target_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'post' THEN
      UPDATE forum_posts
      SET upvotes = GREATEST(upvotes - 1, 0),
          updated_at = NOW()
      WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'reply' THEN
      UPDATE forum_replies
      SET upvotes = GREATEST(upvotes - 1, 0),
          updated_at = NOW()
      WHERE id = OLD.target_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update company active job count
CREATE OR REPLACE FUNCTION update_company_job_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE companies
    SET active_job_count = active_job_count + 1,
        updated_at = NOW()
    WHERE id = NEW.company_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'active' THEN
      UPDATE companies
      SET active_job_count = active_job_count + 1,
          updated_at = NOW()
      WHERE id = NEW.company_id;
    ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE companies
      SET active_job_count = GREATEST(active_job_count - 1, 0),
          updated_at = NOW()
      WHERE id = NEW.company_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE companies
    SET active_job_count = GREATEST(active_job_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.company_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update search vectors (profiles)
CREATE OR REPLACE FUNCTION update_profiles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    COALESCE(NEW.display_name, '') || ' ' ||
    COALESCE(NEW.bio, '') || ' ' ||
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(array_to_string(NEW.skills, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update search vectors (job listings)
CREATE OR REPLACE FUNCTION update_job_listings_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.location, '') || ' ' ||
    COALESCE(array_to_string(NEW.tech_stack, ' '), '') ||
    COALESCE(array_to_string(NEW.requirements, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update search vectors (forum posts)
CREATE OR REPLACE FUNCTION update_forum_posts_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.body, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  title TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  location TEXT,
  is_open_to_work BOOLEAN DEFAULT FALSE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  testimony TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english',
      COALESCE(display_name, '') || ' ' ||
      COALESCE(bio, '') || ' ' ||
      COALESCE(title, '') || ' ' ||
      COALESCE(array_to_string(skills, ' '), '')
    )
  ) STORED
);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ============================================================================
-- COMPANIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  size TEXT CHECK (size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  industry TEXT,
  mission_statement TEXT,
  faith_alignment TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  plan TEXT DEFAULT 'employer' CHECK (plan IN ('employer')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  active_job_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_owner_id ON companies(owner_id);


-- ============================================================================
-- JOB LISTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  nice_to_have TEXT[] DEFAULT '{}',
  job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
  experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
  location_type TEXT NOT NULL CHECK (location_type IN ('remote', 'onsite', 'hybrid')),
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  tech_stack TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  faith_statement TEXT,
  application_url TEXT,
  application_email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english',
      COALESCE(title, '') || ' ' ||
      COALESCE(description, '') || ' ' ||
      COALESCE(location, '') || ' ' ||
      COALESCE(array_to_string(tech_stack, ' '), '') ||
      COALESCE(array_to_string(requirements, ' '), '')
    )
  ) STORED
);

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_listings_company_count
  AFTER INSERT OR UPDATE OR DELETE ON job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_company_job_count();

CREATE INDEX idx_job_listings_company_id ON job_listings(company_id);
CREATE INDEX idx_job_listings_status_expires ON job_listings(status, expires_at);
CREATE INDEX idx_job_listings_location_type ON job_listings(location_type);
CREATE INDEX idx_job_listings_experience_level ON job_listings(experience_level);
CREATE INDEX idx_job_listings_is_featured ON job_listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_job_listings_search ON job_listings USING GIN(search_vector);


-- ============================================================================
-- JOB APPLICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);


-- ============================================================================
-- MENTORSHIP PAIRS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentorship_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  focus_areas TEXT[] DEFAULT '{}',
  meeting_frequency TEXT DEFAULT 'biweekly' CHECK (meeting_frequency IN ('weekly', 'biweekly', 'monthly')),
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (mentor_id != mentee_id)
);

CREATE INDEX idx_mentorship_pairs_mentor_id ON mentorship_pairs(mentor_id);
CREATE INDEX idx_mentorship_pairs_mentee_id ON mentorship_pairs(mentee_id);
CREATE INDEX idx_mentorship_pairs_status ON mentorship_pairs(status);


-- ============================================================================
-- FORUM CATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0
);

CREATE INDEX idx_forum_categories_slug ON forum_categories(slug);


-- ============================================================================
-- FORUM POSTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english',
      COALESCE(title, '') || ' ' ||
      COALESCE(body, '') || ' ' ||
      COALESCE(array_to_string(tags, ' '), '')
    )
  ) STORED
);

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_forum_post_category_count
  AFTER INSERT OR DELETE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_category_post_count();

CREATE INDEX idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_is_pinned ON forum_posts(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_forum_posts_search ON forum_posts USING GIN(search_vector);


-- ============================================================================
-- FORUM REPLIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_forum_reply_post_count
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_post_reply_count();

CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_author_id ON forum_replies(author_id);
CREATE INDEX idx_forum_replies_parent_reply_id ON forum_replies(parent_reply_id);


-- ============================================================================
-- PRAYER REQUESTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  prayer_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_prayer_requests_updated_at
  BEFORE UPDATE ON prayer_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX idx_prayer_requests_created_at ON prayer_requests(created_at DESC);
CREATE INDEX idx_prayer_requests_author_id ON prayer_requests(author_id);


-- ============================================================================
-- PRAYERS TABLE (Tracking who prayed)
-- ============================================================================

CREATE TABLE IF NOT EXISTS prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, user_id)
);

CREATE TRIGGER update_prayer_count_trigger
  AFTER INSERT OR DELETE ON prayers
  FOR EACH ROW
  EXECUTE FUNCTION update_prayer_count();

CREATE INDEX idx_prayers_request_id ON prayers(request_id);
CREATE INDEX idx_prayers_user_id ON prayers(user_id);


-- ============================================================================
-- UPVOTES TABLE (Generic upvote tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'reply')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TRIGGER update_upvote_count_trigger
  AFTER INSERT OR DELETE ON upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_upvote_count();

CREATE INDEX idx_upvotes_user_id ON upvotes(user_id);
CREATE INDEX idx_upvotes_target ON upvotes(target_type, target_id);


-- ============================================================================
-- INDEXES FOR COMMON QUERIES
-- ============================================================================

CREATE INDEX idx_profiles_is_open_to_work ON profiles(is_open_to_work) WHERE is_open_to_work = TRUE;
CREATE INDEX idx_profiles_plan ON profiles(plan);
CREATE INDEX idx_profiles_search ON profiles USING GIN(search_vector);


-- ============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES RLS
-- ============================================================================

-- Read: Everyone can read all profiles
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

-- Update: Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Delete: Users can delete their own profile (cascades via FK)
CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================================================
-- COMPANIES RLS
-- ============================================================================

-- Read: Everyone can read verified companies, owners can read their own
CREATE POLICY "companies_select_verified" ON companies
  FOR SELECT USING (is_verified OR auth.uid() = owner_id);

-- Insert: Authenticated users can create companies
CREATE POLICY "companies_insert" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Update: Only company owner can update
CREATE POLICY "companies_update_own" ON companies
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Delete: Only owner can delete
CREATE POLICY "companies_delete_own" ON companies
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- JOB LISTINGS RLS
-- ============================================================================

-- Read: Everyone can read active jobs, company owners can read their own
CREATE POLICY "job_listings_select" ON job_listings
  FOR SELECT USING (
    status = 'active' OR
    auth.uid() IN (SELECT owner_id FROM companies WHERE companies.id = job_listings.company_id)
  );

-- Insert: Company owners can create job listings
CREATE POLICY "job_listings_insert" ON job_listings
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT owner_id FROM companies WHERE companies.id = company_id)
  );

-- Update: Only company owner can update their listings
CREATE POLICY "job_listings_update" ON job_listings
  FOR UPDATE USING (
    auth.uid() IN (SELECT owner_id FROM companies WHERE companies.id = job_listings.company_id)
  )
  WITH CHECK (
    auth.uid() IN (SELECT owner_id FROM companies WHERE companies.id = job_listings.company_id)
  );

-- Delete: Only company owner can delete
CREATE POLICY "job_listings_delete" ON job_listings
  FOR DELETE USING (
    auth.uid() IN (SELECT owner_id FROM companies WHERE companies.id = job_listings.company_id)
  );

-- ============================================================================
-- JOB APPLICATIONS RLS
-- ============================================================================

-- Read: Applicants can read their own, company owners can read for their jobs
CREATE POLICY "job_applications_select" ON job_applications
  FOR SELECT USING (
    auth.uid() = applicant_id OR
    auth.uid() IN (
      SELECT owner_id FROM companies
      WHERE companies.id IN (
        SELECT company_id FROM job_listings WHERE job_listings.id = job_applications.job_id
      )
    )
  );

-- Insert: Authenticated users can apply
CREATE POLICY "job_applications_insert" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Update: Only applicant or company owner can update
CREATE POLICY "job_applications_update" ON job_applications
  FOR UPDATE USING (
    auth.uid() = applicant_id OR
    auth.uid() IN (
      SELECT owner_id FROM companies
      WHERE companies.id IN (
        SELECT company_id FROM job_listings WHERE job_listings.id = job_applications.job_id
      )
    )
  )
  WITH CHECK (
    auth.uid() = applicant_id OR
    auth.uid() IN (
      SELECT owner_id FROM companies
      WHERE companies.id IN (
        SELECT company_id FROM job_listings WHERE job_listings.id = job_applications.job_id
      )
    )
  );

-- ============================================================================
-- MENTORSHIP PAIRS RLS
-- ============================================================================

-- Read: Mentor and mentee can read their pairs
CREATE POLICY "mentorship_pairs_select" ON mentorship_pairs
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Insert: Authenticated users can create pairs
CREATE POLICY "mentorship_pairs_insert" ON mentorship_pairs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Update: Participants can update their pairs
CREATE POLICY "mentorship_pairs_update" ON mentorship_pairs
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id)
  WITH CHECK (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Delete: Participants can delete
CREATE POLICY "mentorship_pairs_delete" ON mentorship_pairs
  FOR DELETE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- ============================================================================
-- FORUM CATEGORIES RLS
-- ============================================================================

-- Read: Everyone can read
CREATE POLICY "forum_categories_select" ON forum_categories
  FOR SELECT USING (true);

-- ============================================================================
-- FORUM POSTS RLS
-- ============================================================================

-- Read: Everyone can read
CREATE POLICY "forum_posts_select" ON forum_posts
  FOR SELECT USING (true);

-- Insert: Authenticated users can create
CREATE POLICY "forum_posts_insert" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Update: Authors can update their posts
CREATE POLICY "forum_posts_update" ON forum_posts
  FOR UPDATE USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Delete: Authors can delete their posts
CREATE POLICY "forum_posts_delete" ON forum_posts
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================================================
-- FORUM REPLIES RLS
-- ============================================================================

-- Read: Everyone can read
CREATE POLICY "forum_replies_select" ON forum_replies
  FOR SELECT USING (true);

-- Insert: Authenticated users can create
CREATE POLICY "forum_replies_insert" ON forum_replies
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Update: Authors can update their replies
CREATE POLICY "forum_replies_update" ON forum_replies
  FOR UPDATE USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Delete: Authors can delete their replies
CREATE POLICY "forum_replies_delete" ON forum_replies
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================================================
-- PRAYER REQUESTS RLS
-- ============================================================================

-- Read: Everyone can read public prayer requests, authors see their own (including anonymous)
CREATE POLICY "prayer_requests_select" ON prayer_requests
  FOR SELECT USING (
    NOT is_anonymous OR auth.uid() = author_id
  );

-- Insert: Authenticated users can create
CREATE POLICY "prayer_requests_insert" ON prayer_requests
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Update: Authors can update their requests
CREATE POLICY "prayer_requests_update" ON prayer_requests
  FOR UPDATE USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Delete: Authors can delete
CREATE POLICY "prayer_requests_delete" ON prayer_requests
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================================================
-- PRAYERS RLS
-- ============================================================================

-- No direct read access (only affects counts)
-- Insert: Authenticated users can record their prayers
CREATE POLICY "prayers_insert" ON prayers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delete: Users can remove their prayers
CREATE POLICY "prayers_delete" ON prayers
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- UPVOTES RLS
-- ============================================================================

-- No direct read access (only affects counts)
-- Insert: Authenticated users can upvote
CREATE POLICY "upvotes_insert" ON upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delete: Users can remove their upvotes
CREATE POLICY "upvotes_delete" ON upvotes
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================================
-- CREATE INITIAL FORUM CATEGORIES (seed data can be moved to seed.sql)
-- ============================================================================

-- This will be handled by seed.sql, but schema is complete

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================

-- Completed:
-- - 11 production tables with proper constraints and types
-- - Generated search vectors for full-text search on profiles, job_listings, forum_posts
-- - Comprehensive indexing for query performance
-- - Trigger functions for auto-updating counts and timestamps
-- - Complete Row-Level Security policies for all tables
-- - Support for mentorship, job applications, forum discussions, and prayer requests
