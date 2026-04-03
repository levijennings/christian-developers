import { describe, it, expect } from 'vitest';
import {
  jobListingSchema,
  companySchema,
  applicationSchema,
  forumPostSchema,
  forumReplySchema,
  prayerRequestSchema,
  mentorshipRequestSchema,
  profileUpdateSchema,
  paginationSchema,
  upvoteSchema,
  checkoutSchema,
  mentorshipStatusSchema,
  searchSchema,
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('jobListingSchema', () => {
    it('should validate a valid job listing', () => {
      const data = {
        title: 'Senior React Developer',
        description: 'A comprehensive description of the role and responsibilities.',
        requirements: 'Must have 5+ years of React experience',
        job_type: 'full-time',
        experience_level: 'senior',
        location_type: 'remote',
        salary_min: 100000,
        salary_max: 150000,
        tech_stack: ['React', 'TypeScript', 'Node.js'],
      };

      const result = jobListingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject job listing with short title', () => {
      const data = {
        title: 'Dev',
        description: 'A comprehensive description of the role.',
        requirements: 'Must have experience',
        job_type: 'full-time',
        experience_level: 'senior',
        location_type: 'remote',
        tech_stack: ['React'],
      };

      const result = jobListingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject job listing with empty tech stack', () => {
      const data = {
        title: 'Senior React Developer',
        description: 'A comprehensive description of the role.',
        requirements: 'Must have experience',
        job_type: 'full-time',
        experience_level: 'senior',
        location_type: 'remote',
        tech_stack: [],
      };

      const result = jobListingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should allow optional company_id', () => {
      const data = {
        title: 'Senior React Developer',
        description: 'A comprehensive description of the role.',
        requirements: 'Must have experience',
        job_type: 'full-time',
        experience_level: 'senior',
        location_type: 'remote',
        tech_stack: ['React'],
        company_id: '550e8400-e29b-41d4-a716-446655440001',
      };

      const result = jobListingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('companySchema', () => {
    it('should validate a valid company', () => {
      const data = {
        name: 'Faith Tech Solutions',
        description: 'Building technology to serve the church.',
      };

      const result = companySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject company with short name', () => {
      const data = {
        name: 'X',
        description: 'Building technology to serve the church.',
      };

      const result = companySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const data = {
        name: 'Faith Tech',
        description: 'Building technology.',
        website_url: 'https://faithtech.com',
        size: '11-50',
        faith_alignment: 'christian-owned',
      };

      const result = companySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const data = {
        name: 'Faith Tech',
        description: 'Building technology.',
        website_url: 'not-a-url',
      };

      const result = companySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('applicationSchema', () => {
    it('should validate a valid application', () => {
      const data = {
        job_id: '550e8400-e29b-41d4-a716-446655440001',
        cover_letter: 'I am interested in this position because it aligns with my values.',
        resume_url: 'https://example.com/resume.pdf',
      };

      const result = applicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject short cover letter', () => {
      const data = {
        job_id: '550e8400-e29b-41d4-a716-446655440001',
        cover_letter: 'Too short',
        resume_url: 'https://example.com/resume.pdf',
      };

      const result = applicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID', () => {
      const data = {
        job_id: 'not-a-uuid',
        cover_letter: 'I am interested in this position because it aligns with my values.',
        resume_url: 'https://example.com/resume.pdf',
      };

      const result = applicationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('forumPostSchema', () => {
    it('should validate a valid forum post', () => {
      const data = {
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Navigating Career Transitions',
        body: 'This is a detailed discussion about career transitions in tech.',
        tags: ['career', 'growth'],
      };

      const result = forumPostSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow empty tags', () => {
      const data = {
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Navigating Career Transitions',
        body: 'This is a detailed discussion about career transitions in tech.',
      };

      const result = forumPostSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject post with short title', () => {
      const data = {
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Hi',
        body: 'This is a detailed discussion.',
      };

      const result = forumPostSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('forumReplySchema', () => {
    it('should validate a valid forum reply', () => {
      const data = {
        post_id: '550e8400-e29b-41d4-a716-446655440001',
        body: 'This is a helpful reply to the post.',
      };

      const result = forumReplySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow optional parent_reply_id', () => {
      const data = {
        post_id: '550e8400-e29b-41d4-a716-446655440001',
        body: 'This is a reply to another reply.',
        parent_reply_id: '550e8400-e29b-41d4-a716-446655440002',
      };

      const result = forumReplySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject short reply', () => {
      const data = {
        post_id: '550e8400-e29b-41d4-a716-446655440001',
        body: 'Ok',
      };

      const result = forumReplySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('prayerRequestSchema', () => {
    it('should validate a valid prayer request', () => {
      const data = {
        title: 'Pray for wisdom',
        body: 'Please pray that I find the right job opportunity.',
        is_anonymous: false,
      };

      const result = prayerRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should default is_anonymous to false', () => {
      const data = {
        title: 'Pray for wisdom',
        body: 'Please pray that I find the right job opportunity.',
      };

      const result = prayerRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect((result as any).data.is_anonymous).toBe(false);
    });

    it('should allow anonymous requests', () => {
      const data = {
        title: 'Pray for my situation',
        body: 'Please pray for my personal struggle.',
        is_anonymous: true,
      };

      const result = prayerRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('mentorshipRequestSchema', () => {
    it('should validate a valid mentorship request', () => {
      const data = {
        mentor_id: '550e8400-e29b-41d4-a716-446655440001',
        focus_areas: ['Career Growth', 'Technical Skills'],
        meeting_frequency: 'biweekly',
      };

      const result = mentorshipRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject empty focus areas', () => {
      const data = {
        mentor_id: '550e8400-e29b-41d4-a716-446655440001',
        focus_areas: [],
        meeting_frequency: 'biweekly',
      };

      const result = mentorshipRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid frequency', () => {
      const data = {
        mentor_id: '550e8400-e29b-41d4-a716-446655440001',
        focus_areas: ['Career Growth'],
        meeting_frequency: 'daily',
      };

      const result = mentorshipRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('profileUpdateSchema', () => {
    it('should validate partial profile updates', () => {
      const data = {
        display_name: 'John Developer',
        bio: 'Passionate developer',
        skills: ['React', 'TypeScript'],
      };

      const result = profileUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow all fields optional', () => {
      const data = {};

      const result = profileUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow empty string for URLs', () => {
      const data = {
        github_url: '',
        linkedin_url: '',
      };

      const result = profileUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should validate pagination parameters', () => {
      const data = {
        page: 2,
        limit: 50,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should default to page 1 and limit 20', () => {
      const data = {};

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect((result as any).data.page).toBe(1);
      expect((result as any).data.limit).toBe(20);
    });

    it('should coerce string to number', () => {
      const data = {
        page: '3',
        limit: '25',
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect((result as any).data.page).toBe(3);
      expect((result as any).data.limit).toBe(25);
    });

    it('should reject negative page', () => {
      const data = {
        page: -1,
        limit: 20,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should cap limit at 100', () => {
      const data = {
        page: 1,
        limit: 200,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('upvoteSchema', () => {
    it('should validate a valid upvote', () => {
      const data = {
        item_id: '550e8400-e29b-41d4-a716-446655440001',
        item_type: 'post',
      };

      const result = upvoteSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept reply type', () => {
      const data = {
        item_id: '550e8400-e29b-41d4-a716-446655440001',
        item_type: 'reply',
      };

      const result = upvoteSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid item_type', () => {
      const data = {
        item_id: '550e8400-e29b-41d4-a716-446655440001',
        item_type: 'comment',
      };

      const result = upvoteSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('checkoutSchema', () => {
    it('should validate a valid checkout', () => {
      const data = {
        plan_type: 'pro',
        return_url: 'https://example.com/checkout/success',
      };

      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept employer plan', () => {
      const data = {
        plan_type: 'employer',
        return_url: 'https://example.com/checkout/success',
      };

      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid plan_type', () => {
      const data = {
        plan_type: 'premium',
        return_url: 'https://example.com/checkout/success',
      };

      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('mentorshipStatusSchema', () => {
    it('should validate accepted status', () => {
      const data = {
        status: 'accepted',
      };

      const result = mentorshipStatusSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate all status types', () => {
      const statuses = ['accepted', 'declined', 'completed'];

      statuses.forEach((status) => {
        const data = { status };
        const result = mentorshipStatusSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      const data = {
        status: 'pending',
      };

      const result = mentorshipStatusSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('searchSchema', () => {
    it('should validate a valid search query', () => {
      const data = {
        q: 'react developer',
      };

      const result = searchSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept optional type filter', () => {
      const data = {
        q: 'react',
        type: 'jobs',
      };

      const result = searchSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should default page to 1 and limit to 10', () => {
      const data = {
        q: 'react',
      };

      const result = searchSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect((result as any).data.page).toBe(1);
      expect((result as any).data.limit).toBe(10);
    });

    it('should reject empty search query', () => {
      const data = {
        q: '',
      };

      const result = searchSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject oversized query', () => {
      const data = {
        q: 'a'.repeat(501),
      };

      const result = searchSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
