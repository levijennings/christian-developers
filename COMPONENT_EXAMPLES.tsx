/**
 * Christian Developers - Component Library Examples
 * Quick reference examples for all components
 */

import React, { useState } from 'react';
import { Briefcase, Heart, Users, Mail } from 'lucide-react';

// UI Components
import {
  Button,
  Input,
  Select,
  Card,
  Badge,
  Avatar,
  Tabs,
  Modal,
  useToast,
  Skeleton,
  EmptyState,
} from '@/components/ui';

// Job Components
import {
  JobCard,
  JobList,
  JobFilters,
  CompanyCard,
} from '@/components/jobs';

// Community Components
import {
  ForumPostCard,
  ForumReply,
  PrayerRequestCard,
  MentorCard,
} from '@/components/community';

// Layout Components
import { Header, Footer, Sidebar } from '@/components/layout';

// ============================================================================
// UI COMPONENTS EXAMPLES
// ============================================================================

export function InputExample() {
  return (
    <div className="space-y-6">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        variant="default"
      />

      <Input
        variant="search"
        placeholder="Search jobs, posts..."
      />

      <Input
        variant="textarea"
        label="Message"
        placeholder="Enter your message"
        helperText="Max 500 characters"
      />

      <Input
        label="Password"
        type="password"
        error="Password must be at least 8 characters"
      />
    </div>
  );
}

export function SelectExample() {
  return (
    <Select
      label="Experience Level"
      placeholder="Select your level"
      options={[
        { value: 'junior', label: 'Junior (0-2 years)' },
        { value: 'mid', label: 'Mid-level (2-5 years)' },
        { value: 'senior', label: 'Senior (5+ years)' },
        { value: 'lead', label: 'Lead / Manager' },
      ]}
    />
  );
}

export function ButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      <Button variant="primary" size="md">
        Apply Now
      </Button>

      <Button variant="secondary" size="lg">
        Save for Later
      </Button>

      <Button variant="ghost">
        View Details
      </Button>

      <Button variant="danger" disabled>
        Delete
      </Button>

      <Button
        isLoading={isLoading}
        onClick={() => setIsLoading(!isLoading)}
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>

      <Button
        fullWidth
        icon={<Briefcase className="h-4 w-4" />}
      >
        View Jobs
      </Button>
    </div>
  );
}

export function CardExample() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Regular Card</h3>
        <p className="text-gray-600">Card with default styling</p>
      </Card>

      <Card hover featured className="p-6">
        <h3 className="text-lg font-semibold mb-2">Featured Card</h3>
        <p className="text-gray-600">
          Card with hover effect and featured left border
        </p>
      </Card>
    </div>
  );
}

export function BadgeExample() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" color="indigo">
          Featured
        </Badge>
        <Badge variant="default" color="green">
          Featured
        </Badge>
        <Badge variant="default" color="blue">
          Featured
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="tech-stack" size="sm">
          React
        </Badge>
        <Badge variant="tech-stack" size="sm">
          TypeScript
        </Badge>
        <Badge variant="tech-stack" size="sm">
          Node.js
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="job-type" jobType="full-time" size="sm">
          Full-time
        </Badge>
        <Badge variant="job-type" jobType="contract" size="sm">
          Contract
        </Badge>
        <Badge variant="job-type" jobType="freelance" size="sm">
          Freelance
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="location-type" locationType="remote" size="sm">
          Remote
        </Badge>
        <Badge variant="location-type" locationType="onsite" size="sm">
          On-site
        </Badge>
        <Badge variant="location-type" locationType="hybrid" size="sm">
          Hybrid
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="experience-level" experienceLevel="junior" size="sm">
          Junior
        </Badge>
        <Badge variant="experience-level" experienceLevel="mid" size="sm">
          Mid-level
        </Badge>
        <Badge variant="experience-level" experienceLevel="senior" size="sm">
          Senior
        </Badge>
      </div>
    </div>
  );
}

export function AvatarExample() {
  return (
    <div className="flex items-center gap-8">
      <Avatar initials="JD" size="sm" />
      <Avatar initials="JD" size="md" onlineStatus={true} />
      <Avatar initials="JD" size="lg" openToWork={true} />
      <Avatar initials="JD" size="xl" openToWork={true} onlineStatus={true} />
    </div>
  );
}

export function TabsExample() {
  return (
    <Tabs
      defaultTab="jobs"
      tabs={[
        {
          id: 'jobs',
          label: 'My Jobs',
          icon: <Briefcase className="h-4 w-4" />,
          content: <div>Jobs content</div>,
        },
        {
          id: 'saved',
          label: 'Saved',
          icon: <Heart className="h-4 w-4" />,
          content: <div>Saved content</div>,
        },
        {
          id: 'applied',
          label: 'Applied',
          content: <div>Applied content</div>,
        },
      ]}
      onChange={(tabId) => console.log('Tab changed:', tabId)}
    />
  );
}

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Application"
        size="md"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to apply for this position?
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsOpen(false);
              // Handle submit
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function ToastExample() {
  const { addToast } = useToast();

  return (
    <div className="space-y-2">
      <Button
        onClick={() => addToast('Success! Changes saved.', 'success')}
      >
        Success Toast
      </Button>
      <Button
        onClick={() => addToast('Error! Something went wrong.', 'error')}
        variant="danger"
      >
        Error Toast
      </Button>
      <Button
        onClick={() => addToast('Info: Your subscription expires in 7 days.', 'info')}
        variant="secondary"
      >
        Info Toast
      </Button>
    </div>
  );
}

export function SkeletonExample() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>

      <Skeleton variant="rect" width="100%" height="200px" />

      <Skeleton variant="text" count={3} />
    </div>
  );
}

export function EmptyStateExample() {
  return (
    <EmptyState
      icon={Briefcase}
      title="No jobs found"
      description="Try adjusting your filters or search criteria."
      action={{
        label: 'Clear Filters',
        onClick: () => console.log('Clear filters'),
      }}
      variant="centered"
    />
  );
}

// ============================================================================
// JOB COMPONENTS EXAMPLES
// ============================================================================

export function JobCardExample() {
  return (
    <JobCard
      id="job-1"
      companyName="TechCorp Christian"
      companyLogo="/logos/techcorp.png"
      jobTitle="Senior Full Stack Developer"
      locationType="remote"
      jobType="full-time"
      salaryMin={120000}
      salaryMax={160000}
      techStack={['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']}
      postedAt={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)} // 2 days ago
      featured={true}
      onApply={() => console.log('Applied!')}
    />
  );
}

export function JobListExample() {
  const jobsData = [
    {
      id: 'job-1',
      companyName: 'TechCorp',
      jobTitle: 'Senior Developer',
      locationType: 'remote' as const,
      jobType: 'full-time' as const,
      salaryMin: 120000,
      salaryMax: 160000,
      techStack: ['React', 'TypeScript', 'Node.js'],
      postedAt: new Date(),
      featured: true,
    },
    {
      id: 'job-2',
      companyName: 'StartupCo',
      jobTitle: 'Mid-Level Engineer',
      locationType: 'hybrid' as const,
      jobType: 'full-time' as const,
      salaryMin: 90000,
      salaryMax: 120000,
      techStack: ['React', 'Vue', 'Python'],
      postedAt: new Date(),
      featured: false,
    },
  ];

  return (
    <JobList
      jobs={jobsData}
      isLoading={false}
      onJobApply={(jobId) => console.log('Apply clicked:', jobId)}
    />
  );
}

export function CompanyCardExample() {
  return (
    <CompanyCard
      id="company-1"
      name="Christian Tech Solutions"
      logo="/logos/christian-tech.png"
      size="Series A, 50-100 employees"
      industry="SaaS / Enterprise Software"
      missionExcerpt="Building enterprise software solutions that glorify God and serve humanity."
      activeJobCount={5}
      onViewJobs={() => console.log('View jobs')}
    />
  );
}

// ============================================================================
// COMMUNITY COMPONENTS EXAMPLES
// ============================================================================

export function ForumPostCardExample() {
  return (
    <ForumPostCard
      id="post-1"
      authorName="Sarah Johnson"
      authorInitials="SJ"
      title="How do you balance career ambitions with faith?"
      bodyExcerpt="I've been offered a great opportunity at a large tech company, but I'm worried about..."
      category="Faith & Work"
      tags={['career', 'faith', 'balance']}
      upvoteCount={42}
      replyCount={12}
      postedAt={new Date(Date.now() - 3 * 60 * 60 * 1000)} // 3 hours ago
      onPostClick={() => console.log('Post clicked')}
      onUpvote={() => console.log('Upvoted')}
    />
  );
}

export function ForumReplyExample() {
  return (
    <ForumReply
      id="reply-1"
      authorName="John Smith"
      authorInitials="JS"
      authorIsOp={true}
      body="Thanks for the thoughtful response. I've been praying about this and your perspective really helps."
      upvoteCount={8}
      postedAt={new Date()}
      onReply={() => console.log('Reply to this')}
      onUpvote={() => console.log('Upvoted')}
      depth={1}
    />
  );
}

export function PrayerRequestCardExample() {
  return (
    <PrayerRequestCard
      id="prayer-1"
      title="Guidance on career transition"
      body="I'm considering leaving my current role after 5 years to pursue something more aligned with my values..."
      prayerCount={45}
      status="active"
      isAnonymous={false}
      createdAt={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
      onPray={() => console.log('Added prayer')}
    />
  );
}

export function MentorCardExample() {
  return (
    <MentorCard
      id="mentor-1"
      name="David Chen"
      initials="DC"
      title="Engineering Manager at Google"
      experienceYears={12}
      skills={['System Design', 'TypeScript', 'React', 'Leadership', 'Mentoring']}
      focusAreas={['Career Growth', 'Technical Leadership', 'Work-Life Balance']}
      openToWork={true}
      onRequestMentorship={() => console.log('Request mentorship')}
    />
  );
}

// ============================================================================
// LAYOUT COMPONENTS EXAMPLES
// ============================================================================

export function HeaderExample() {
  return (
    <Header
      onSearch={(query) => console.log('Search:', query)}
      onNavigate={(path) => console.log('Navigate:', path)}
      isAuthenticated={true}
      userName="John Doe"
    />
  );
}

export function FooterExample() {
  return (
    <Footer
      stats={{
        totalMembers: 5240,
        jobsPosted: 342,
        prayerRequests: 1203,
      }}
      verseOfTheDay={{
        text: 'Therefore, as God\'s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.',
        reference: 'Colossians 3:12',
      }}
    />
  );
}

export function SidebarExample() {
  return (
    <Sidebar
      categories={[
        { id: '1', name: 'Career Advice', postCount: 234, color: 'blue' },
        { id: '2', name: 'Technical Help', postCount: 567, color: 'purple' },
        { id: '3', name: 'Faith & Work', postCount: 189, color: 'rose' },
      ]}
      trendingTags={[
        { id: '1', name: 'React', count: 234 },
        { id: '2', name: 'Remote', count: 189 },
        { id: '3', name: 'Startup', count: 156 },
      ]}
      featuredPrayerRequests={[
        { id: '1', title: 'Guidance on job decision', prayerCount: 45 },
        { id: '2', title: 'Wisdom for current project', prayerCount: 32 },
      ]}
      onCategoryClick={(id) => console.log('Category:', id)}
      onTagClick={(tag) => console.log('Tag:', tag)}
      onPrayerRequestClick={(id) => console.log('Prayer:', id)}
    />
  );
}

// ============================================================================
// FULL PAGE EXAMPLE
// ============================================================================

export function FullPageExample() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isAuthenticated={true}
        userName="John Doe"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Featured Jobs</h1>
          <JobList
            jobs={[
              {
                id: 'job-1',
                companyName: 'TechCorp',
                jobTitle: 'Senior Developer',
                locationType: 'remote' as const,
                jobType: 'full-time' as const,
                salaryMin: 120000,
                salaryMax: 160000,
                techStack: ['React', 'TypeScript', 'Node.js'],
                postedAt: new Date(),
                featured: true,
              },
            ]}
          />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </main>

      <Footer />
    </div>
  );
}
