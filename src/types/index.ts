export interface JobListing {
  id: string
  company_id: string
  title: string
  description: string
  requirements: string[]
  nice_to_have: string[]
  job_type: 'full_time' | 'part_time' | 'contract' | 'freelance'
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  location_type: 'remote' | 'onsite' | 'hybrid'
  location?: string
  salary_min?: number
  salary_max?: number
  salary_currency: string
  tech_stack: string[]
  is_featured: boolean
  faith_statement?: string
  application_url?: string
  expires_at: string
  created_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  description: string
  website_url: string
  logo_url?: string
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  industry: string
  mission_statement?: string
  faith_alignment: string
  location: string
  active_jobs: number
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio: string
  title: string
  skills: string[]
  experience_years: number
  location: string
  is_open_to_work: boolean
  plan: 'free' | 'pro'
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  testimony?: string
  created_at: string
}

export interface MentorshipPair {
  id: string
  mentor_id: string
  mentee_id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  focus_areas: string[]
  meeting_frequency: 'weekly' | 'biweekly' | 'monthly'
  started_at?: string
  created_at: string
}

export interface ForumPost {
  id: string
  author_id: string
  category: 'general' | 'career' | 'faith_tech' | 'prayer' | 'projects' | 'learning'
  title: string
  body: string
  tags: string[]
  upvotes: number
  reply_count: number
  is_pinned: boolean
  created_at: string
}

export interface PrayerRequest {
  id: string
  author_id: string
  title: string
  body: string
  is_anonymous: boolean
  prayer_count: number
  status: 'active' | 'answered' | 'closed'
  created_at: string
}
