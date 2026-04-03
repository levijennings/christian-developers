import { JobListing, Company, UserProfile, ForumPost, PrayerRequest, MentorshipPair } from '@/types/index';

/**
 * Create a mock job listing for testing
 */
export function createMockJob(overrides?: Partial<JobListing>): JobListing {
  return {
    id: '550e8400-e29b-41d4-a716-446655440001',
    company_id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team collaboration'],
    nice_to_have: ['Next.js experience', 'GraphQL knowledge'],
    job_type: 'full_time',
    experience_level: 'senior',
    location_type: 'remote',
    location: 'USA',
    salary_min: 120000,
    salary_max: 160000,
    salary_currency: 'USD',
    tech_stack: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    is_featured: false,
    faith_statement: 'Jesus-centered culture',
    application_url: 'https://careers.example.com/apply/123',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock company for testing
 */
export function createMockCompany(overrides?: Partial<Company>): Company {
  return {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Faith Tech Solutions',
    slug: 'faith-tech-solutions',
    description: 'Building technology to serve the church and Christian community.',
    website_url: 'https://faithtech.example.com',
    logo_url: 'https://faithtech.example.com/logo.png',
    size: 'small',
    industry: 'Software',
    mission_statement: 'Using technology to glorify God',
    faith_alignment: 'christian-owned',
    location: 'Austin, TX',
    active_jobs: 5,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock user profile for testing
 */
export function createMockProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'developer@example.com',
    display_name: 'John Developer',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Passionate developer and Christian seeking meaningful work.',
    title: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    experience_years: 5,
    location: 'Austin, TX',
    is_open_to_work: true,
    plan: 'free',
    github_url: 'https://github.com/developer',
    linkedin_url: 'https://linkedin.com/in/developer',
    portfolio_url: 'https://developer.example.com',
    testimony: 'God has guided my career path in amazing ways.',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock forum post for testing
 */
export function createMockForumPost(overrides?: Partial<ForumPost>): ForumPost {
  return {
    id: '550e8400-e29b-41d4-a716-446655440004',
    author_id: '550e8400-e29b-41d4-a716-446655440003',
    category: 'career',
    title: 'Navigating Career Transitions in Tech',
    body: 'I am considering a career transition from backend to frontend development. How do others approach this?',
    tags: ['career', 'transition', 'learning'],
    upvotes: 12,
    reply_count: 5,
    is_pinned: false,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock prayer request for testing
 */
export function createMockPrayerRequest(overrides?: Partial<PrayerRequest>): PrayerRequest {
  return {
    id: '550e8400-e29b-41d4-a716-446655440005',
    author_id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Pray for wisdom in job search',
    body: 'Please pray that God guides me to the right opportunity that aligns with my faith values.',
    is_anonymous: false,
    prayer_count: 8,
    status: 'active',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock mentorship pair for testing
 */
export function createMockMentorshipPair(overrides?: Partial<MentorshipPair>): MentorshipPair {
  return {
    id: '550e8400-e29b-41d4-a716-446655440006',
    mentor_id: '550e8400-e29b-41d4-a716-446655440007',
    mentee_id: '550e8400-e29b-41d4-a716-446655440003',
    status: 'pending',
    focus_areas: ['Career Growth', 'Technical Skills', 'Faith and Work'],
    meeting_frequency: 'biweekly',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock authenticated user session
 */
export function createMockAuthSession(overrides?: any) {
  return {
    user: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 'developer@example.com',
      ...overrides?.user,
    },
    session: {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      ...overrides?.session,
    },
  };
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
