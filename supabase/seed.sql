-- Christian Developers: Seed Data
-- Production seed data for initial deployment

-- ============================================================================
-- FORUM CATEGORIES
-- ============================================================================

INSERT INTO forum_categories (name, slug, description, icon, display_order)
VALUES
  (
    'General Discussion',
    'general-discussion',
    'General conversation about tech, faith, and the community',
    '💬',
    0
  ),
  (
    'Career Advice',
    'career-advice',
    'Job search tips, interview prep, salary negotiation, and career growth',
    '💼',
    1
  ),
  (
    'Faith & Technology',
    'faith-technology',
    'Discussing Christianity in tech: ethics, values, and purpose-driven work',
    '⛪',
    2
  ),
  (
    'Prayer Requests',
    'prayer-requests',
    'Share prayer requests and pray for fellow developers',
    '🙏',
    3
  ),
  (
    'Project Showcase',
    'project-showcase',
    'Share what you''re building and get feedback from the community',
    '🚀',
    4
  ),
  (
    'Learning & Resources',
    'learning-resources',
    'Share tutorials, courses, books, and learning resources',
    '📚',
    5
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Seed data complete. Forum categories are now available for use.
-- Additional seed data (sample companies, jobs, etc.) can be added as needed.
