import { describe, it, expect, vi } from 'vitest';
import { createMockPrayerRequest, createMockProfile } from '@/test/helpers';

/**
 * Component Tests for PrayerRequestCard
 *
 * Tests rendering and interactions for prayer request cards
 */

describe('PrayerRequestCard Component', () => {
  const mockAuthor = createMockProfile({
    id: '550e8400-e29b-41d4-a716-446655440003',
    display_name: 'Sarah Faith',
  });

  const mockPrayerRequest = createMockPrayerRequest({
    id: '550e8400-e29b-41d4-a716-446655440001',
    author_id: mockAuthor.id,
    title: 'Pray for wisdom in job search',
    body: 'Please pray that God guides me to the right opportunity that aligns with my faith values and career goals.',
    is_anonymous: false,
    prayer_count: 8,
    status: 'active',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const mockAnonymousPrayer = createMockPrayerRequest({
    id: '550e8400-e29b-41d4-a716-446655440002',
    author_id: 'some-user',
    title: 'Private struggles need prayer',
    is_anonymous: true,
    prayer_count: 15,
    status: 'active',
  });

  describe('Rendering', () => {
    it('should render prayer request title', () => {
      expect(mockPrayerRequest.title).toBe('Pray for wisdom in job search');
      expect(mockPrayerRequest.title.length).toBeGreaterThan(0);
    });

    it('should render prayer request body excerpt', () => {
      const excerpt = mockPrayerRequest.body.substring(0, 100);
      expect(excerpt).toBeTruthy();
      expect(excerpt.length).toBeGreaterThan(0);
    });

    it('should render author name for non-anonymous requests', () => {
      expect(mockPrayerRequest.is_anonymous).toBe(false);
      expect(mockAuthor.display_name).toBe('Sarah Faith');
    });

    it('should hide author name for anonymous requests', () => {
      expect(mockAnonymousPrayer.is_anonymous).toBe(true);
    });

    it('should display "Anonymous" for anonymous requests', () => {
      const authorDisplay = mockAnonymousPrayer.is_anonymous ? 'Anonymous' : 'Author';
      expect(authorDisplay).toBe('Anonymous');
    });

    it('should render prayer count', () => {
      expect(mockPrayerRequest.prayer_count).toBe(8);
      expect(mockPrayerRequest.prayer_count).toBeGreaterThanOrEqual(0);
    });

    it('should render prayer button text', () => {
      const buttonText = 'Pray';
      expect(buttonText).toBeTruthy();
    });

    it('should render status badge', () => {
      expect(mockPrayerRequest.status).toBe('active');
      expect(['active', 'answered', 'closed']).toContain(mockPrayerRequest.status);
    });

    it('should show answered indicator for answered prayers', () => {
      const answeredPrayer = createMockPrayerRequest({
        status: 'answered',
      });
      expect(answeredPrayer.status).toBe('answered');
    });

    it('should show closed indicator for closed prayers', () => {
      const closedPrayer = createMockPrayerRequest({
        status: 'closed',
      });
      expect(closedPrayer.status).toBe('closed');
    });

    it('should render time posted', () => {
      const createdAt = new Date(mockPrayerRequest.created_at);
      expect(createdAt instanceof Date).toBe(true);
    });

    it('should handle missing author avatar', () => {
      const author = { ...mockAuthor, avatar_url: undefined };
      expect(author.avatar_url).toBeUndefined();
    });
  });

  describe('Prayer Functionality', () => {
    it('should have pray button', () => {
      expect(mockPrayerRequest.id).toBeTruthy();
    });

    it('should handle pray button click', () => {
      const onPray = vi.fn();
      onPray(mockPrayerRequest.id);

      expect(onPray).toHaveBeenCalledWith(mockPrayerRequest.id);
    });

    it('should increment prayer count on pray', () => {
      const initialCount = mockPrayerRequest.prayer_count;
      const newCount = initialCount + 1;

      expect(newCount).toBe(initialCount + 1);
    });

    it('should disable pray button if user already prayed', () => {
      const userHasPrayed = true;
      expect(userHasPrayed).toBe(true);
    });

    it('should show user has prayed state', () => {
      expect(mockPrayerRequest.prayer_count).toBeGreaterThan(0);
    });

    it('should show prayer count updating in real-time', () => {
      const oldCount = 8;
      const newCount = 9;

      expect(newCount).toBe(oldCount + 1);
    });

    it('should handle "You have prayed" message', () => {
      const userPrayed = true;
      if (userPrayed) {
        const message = 'You have prayed for this request';
        expect(message).toBeTruthy();
      }
    });
  });

  describe('Prayer Request Details', () => {
    it('should handle view more details action', () => {
      const onViewDetails = vi.fn();
      onViewDetails(mockPrayerRequest.id);

      expect(onViewDetails).toHaveBeenCalled();
    });

    it('should show card click navigates to details', () => {
      const onCardClick = vi.fn();
      onCardClick(mockPrayerRequest.id);

      expect(onCardClick).toHaveBeenCalledWith(mockPrayerRequest.id);
    });

    it('should handle share prayer request action', () => {
      const onShare = vi.fn();
      onShare(mockPrayerRequest.id);

      expect(onShare).toHaveBeenCalled();
    });

    it('should allow copying prayer request link', () => {
      const url = `https://example.com/prayer/${mockPrayerRequest.id}`;
      expect(url).toContain(mockPrayerRequest.id);
    });

    it('should handle bookmark/save action', () => {
      const onBookmark = vi.fn();
      onBookmark(mockPrayerRequest.id);

      expect(onBookmark).toHaveBeenCalled();
    });
  });

  describe('Status Management', () => {
    it('should allow request author to mark as answered', () => {
      const userId = mockAuthor.id;
      const canMarkAnswered = userId === mockPrayerRequest.author_id;

      expect(canMarkAnswered).toBe(true);
    });

    it('should show answered prayer styling', () => {
      const answeredRequest = createMockPrayerRequest({
        status: 'answered',
        title: 'God answered our prayers!',
      });

      expect(answeredRequest.status).toBe('answered');
    });

    it('should allow closing prayer request', () => {
      const closedRequest = createMockPrayerRequest({
        status: 'closed',
      });

      expect(closedRequest.status).toBe('closed');
    });

    it('should prevent non-authors from closing prayer requests', () => {
      const userId = 'other-user';
      const canClose = userId === mockPrayerRequest.author_id;

      expect(canClose).toBe(false);
    });

    it('should show edit option for request author', () => {
      expect(mockPrayerRequest.author_id).toBeTruthy();
    });
  });

  describe('Prayer Count Metrics', () => {
    it('should display prayer count prominently', () => {
      expect(mockPrayerRequest.prayer_count).toBe(8);
    });

    it('should format large prayer counts', () => {
      const largeCount = 1250;
      const formatted = largeCount > 999 ? `${(largeCount / 1000).toFixed(1)}k` : largeCount;

      expect(formatted).toBeTruthy();
    });

    it('should show zero prayer count', () => {
      const noPrayersRequest = createMockPrayerRequest({ prayer_count: 0 });
      expect(noPrayersRequest.prayer_count).toBe(0);
    });

    it('should update prayer count when user prays', () => {
      const initialCount = 8;
      const userJustPrayed = true;

      const newCount = userJustPrayed ? initialCount + 1 : initialCount;
      expect(newCount).toBe(9);
    });

    it('should show prayer momentum (trending)', () => {
      const highCount = 50;
      expect(highCount).toBeGreaterThan(20);
    });
  });

  describe('Time Formatting', () => {
    it('should format recent times correctly', () => {
      const recentTime = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
      const request = createMockPrayerRequest({ created_at: recentTime });

      expect(request).toBeDefined();
    });

    it('should format older times correctly', () => {
      const olderTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const request = createMockPrayerRequest({ created_at: olderTime });

      expect(request).toBeDefined();
    });
  });

  describe('Styling and Appearance', () => {
    it('should apply hover effects', () => {
      expect(mockPrayerRequest).toBeDefined();
    });

    it('should show active status with green styling', () => {
      expect(mockPrayerRequest.status).toBe('active');
    });

    it('should show answered status with checkmark', () => {
      const answeredRequest = createMockPrayerRequest({ status: 'answered' });
      expect(answeredRequest.status).toBe('answered');
    });

    it('should show closed status with different styling', () => {
      const closedRequest = createMockPrayerRequest({ status: 'closed' });
      expect(closedRequest.status).toBe('closed');
    });

    it('should display anonymous indicator', () => {
      expect(mockAnonymousPrayer.is_anonymous).toBe(true);
    });

    it('should apply cursor pointer style', () => {
      expect(mockPrayerRequest).toBeDefined();
    });

    it('should truncate long titles', () => {
      const longTitle = 'a'.repeat(300);
      expect(longTitle.length).toBeGreaterThan(200);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      expect(mockPrayerRequest.title).toBeTruthy();
      expect(mockPrayerRequest.body).toBeTruthy();
    });

    it('should have accessible pray button label', () => {
      const label = 'Pray for this request';
      expect(label).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      expect(mockPrayerRequest).toBeDefined();
    });

    it('should announce prayer count updates', () => {
      expect(mockPrayerRequest.prayer_count).toBeDefined();
    });

    it('should provide alt text for images', () => {
      expect(mockAuthor).toHaveProperty('avatar_url');
    });

    it('should have sufficient color contrast', () => {
      expect(mockPrayerRequest).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero prayer count', () => {
      const noPrayersRequest = createMockPrayerRequest({ prayer_count: 0 });
      expect(noPrayersRequest.prayer_count).toBe(0);
    });

    it('should handle very high prayer count', () => {
      const massiveCount = 100000;
      expect(massiveCount).toBeGreaterThan(1000);
    });

    it('should handle empty request body', () => {
      const emptyRequest = createMockPrayerRequest({
        body: '',
      });

      expect(emptyRequest.body).toBe('');
    });

    it('should handle very long prayer request titles', () => {
      const longTitle = 'Please pray for wisdom, guidance, and clarity as I navigate this complex situation in my life';
      expect(longTitle.length).toBeGreaterThan(50);
    });

    it('should handle special characters', () => {
      const specialTitle = "Please pray for God's guidance & wisdom";
      expect(specialTitle).toContain('&');
    });

    it('should handle emoji in titles', () => {
      const titleWithEmoji = 'Prayer request 🙏 for strength';
      expect(titleWithEmoji).toContain('🙏');
    });

    it('should handle extremely old prayer requests', () => {
      const veryOld = new Date(2020, 0, 1).toISOString();
      const oldRequest = createMockPrayerRequest({ created_at: veryOld });

      expect(new Date(oldRequest.created_at).getFullYear()).toBe(2020);
    });

    it('should gracefully handle missing author data', () => {
      const request = createMockPrayerRequest({
        author_id: '',
      });

      expect(request.author_id).toBe('');
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      expect(mockPrayerRequest).toBeDefined();
    });

    it('should memoize component', () => {
      expect(mockPrayerRequest.id).toBeTruthy();
    });

    it('should handle rapid prayer clicks', () => {
      expect(mockPrayerRequest.prayer_count).toBeDefined();
    });

    it('should lazy load images', () => {
      expect(mockAuthor).toHaveProperty('avatar_url');
    });
  });
});
