import { z } from 'zod';

// Job Listing Schema
export const jobListingSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  requirements: z.string().min(10).max(2000),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead']),
  location_type: z.enum(['remote', 'hybrid', 'on-site']),
  salary_min: z.number().int().positive().optional(),
  salary_max: z.number().int().positive().optional(),
  tech_stack: z.array(z.string()).min(1).max(20),
  company_id: z.string().uuid().optional(),
});

// Company Schema
export const companySchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(3000),
  website_url: z.string().url().optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  industry: z.string().max(100).optional(),
  mission_statement: z.string().max(1000).optional(),
  faith_alignment: z.enum(['christian-owned', 'christian-values', 'multi-faith', 'secular']).optional(),
  logo_url: z.string().url().optional(),
});

// Job Application Schema
export const applicationSchema = z.object({
  job_id: z.string().uuid(),
  cover_letter: z.string().min(50).max(3000),
  resume_url: z.string().url(),
});

// Forum Post Schema
export const forumPostSchema = z.object({
  category_id: z.string().uuid(),
  title: z.string().min(5).max(300),
  body: z.string().min(20).max(10000),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

// Forum Reply Schema
export const forumReplySchema = z.object({
  post_id: z.string().uuid(),
  body: z.string().min(5).max(5000),
  parent_reply_id: z.string().uuid().optional(),
});

// Prayer Request Schema
export const prayerRequestSchema = z.object({
  title: z.string().min(5).max(300),
  body: z.string().min(10).max(5000),
  is_anonymous: z.boolean().optional().default(false),
});

// Mentorship Request Schema
export const mentorshipRequestSchema = z.object({
  mentor_id: z.string().uuid(),
  focus_areas: z.array(z.string()).min(1).max(10),
  meeting_frequency: z.enum(['weekly', 'biweekly', 'monthly']),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  display_name: z.string().min(2).max(100).optional(),
  bio: z.string().max(1000).optional(),
  title: z.string().max(200).optional(),
  skills: z.array(z.string().max(50)).max(20).optional(),
  location: z.string().max(200).optional(),
  is_open_to_work: z.boolean().optional(),
  github_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  testimony: z.string().max(2000).optional(),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Upvote Schema
export const upvoteSchema = z.object({
  item_id: z.string().uuid(),
  item_type: z.enum(['post', 'reply']),
});

// Stripe Checkout Schema
export const checkoutSchema = z.object({
  plan_type: z.enum(['pro', 'employer']),
  return_url: z.string().url(),
});

// Mentorship Status Update Schema
export const mentorshipStatusSchema = z.object({
  status: z.enum(['accepted', 'declined', 'completed']),
});

// Search Schema
export const searchSchema = z.object({
  q: z.string().min(1).max(500),
  type: z.enum(['jobs', 'profiles', 'posts']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
