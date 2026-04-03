# Christian Developers - Component Library

A complete, production-ready UI component library for the Christian Developers platform built with Next.js 14, Tailwind CSS, and Lucide React icons.

## Design System

### Brand Colors
- **Primary**: Royal Indigo (#4F46E5) - `indigo-600` in Tailwind
- **Light Mode**: Default with warm tones
- **Font**: Instrument Sans

### Component Structure
```
src/components/
├── ui/                 # Base UI components
├── jobs/              # Job board components
├── community/         # Community features (forum, prayer, mentorship)
└── layout/           # Layout components (header, footer, sidebar)
```

## UI Components

### Input
**File**: `src/components/ui/Input.tsx`

Multi-purpose text input component with support for labels, error states, and helper text.

**Variants**:
- `default` - Standard text input
- `search` - Search input with icon
- `textarea` - Multiline input

**Props**:
```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'search' | 'textarea';
  disabled?: boolean;
}
```

**Usage**:
```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  variant="default"
/>

<Input
  variant="search"
  placeholder="Search jobs..."
/>

<Input
  variant="textarea"
  label="Message"
  helperText="Max 500 characters"
/>
```

---

### Select
**File**: `src/components/ui/Select.tsx`

Dropdown select component with label and error support.

**Props**:
```typescript
interface SelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  options: SelectOption[];
}

interface SelectOption {
  value: string;
  label: string;
}
```

**Usage**:
```tsx
<Select
  label="Experience Level"
  placeholder="Select level"
  options={[
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid-level' },
    { value: 'senior', label: 'Senior' },
  ]}
/>
```

---

### Button
**File**: `src/components/ui/Button.tsx`

Versatile button component with multiple variants and sizes.

**Variants**: `primary`, `secondary`, `ghost`, `danger`
**Sizes**: `sm`, `md`, `lg`

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}
```

**Usage**:
```tsx
<Button variant="primary" size="md">
  Apply Now
</Button>

<Button
  variant="secondary"
  icon={<ArrowRight />}
  fullWidth
>
  View Details
</Button>

<Button variant="danger" disabled>
  Delete
</Button>
```

---

### Card
**File**: `src/components/ui/Card.tsx`

Generic container component for content sections.

**Props**:
```typescript
interface CardProps {
  hover?: boolean;        // Enable hover effects
  featured?: boolean;     // Add indigo left border
}
```

**Usage**:
```tsx
<Card hover featured>
  <div className="p-6">
    Featured job card content
  </div>
</Card>
```

---

### Badge
**File**: `src/components/ui/Badge.tsx`

Status/label component with multiple variants optimized for different use cases.

**Variants**:
- `default` - Colored badge
- `tech-stack` - For skills/languages
- `job-type` - Full-time (green), Contract (amber), Freelance (purple)
- `experience-level` - Junior, Mid, Senior, Lead
- `location-type` - Remote (green), Onsite (blue), Hybrid (indigo)

**Sizes**: `sm`, `md`

**Props**:
```typescript
interface BadgeProps {
  variant?: 'default' | 'tech-stack' | 'job-type' | 'experience-level' | 'location-type';
  color?: 'indigo' | 'green' | 'amber' | 'purple' | 'blue' | 'gray';
  jobType?: 'full-time' | 'contract' | 'freelance';
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead';
  locationType?: 'remote' | 'onsite' | 'hybrid';
  size?: 'sm' | 'md';
}
```

**Usage**:
```tsx
<Badge variant="default" color="indigo">Featured</Badge>

<Badge variant="tech-stack" size="sm">React</Badge>

<Badge variant="job-type" jobType="full-time">Full-time</Badge>

<Badge variant="location-type" locationType="remote">Remote</Badge>

<Badge variant="experience-level" experienceLevel="senior">Senior</Badge>
```

---

### Avatar
**File**: `src/components/ui/Avatar.tsx`

User profile avatar with optional online status and "open to work" indicator.

**Sizes**: `sm`, `md`, `lg`, `xl`

**Props**:
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onlineStatus?: boolean;    // Green dot
  openToWork?: boolean;      // Green ring
}
```

**Usage**:
```tsx
<Avatar
  src="/avatars/john.jpg"
  alt="John Doe"
  size="md"
  onlineStatus={true}
  openToWork={true}
/>

<Avatar
  initials="JD"
  size="lg"
/>
```

---

### Tabs
**File**: `src/components/ui/Tabs.tsx`

Horizontal tab navigation with underline active state.

**Props**:
```typescript
interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
}

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

**Usage**:
```tsx
<Tabs
  defaultTab="jobs"
  onChange={(tabId) => console.log(tabId)}
  tabs={[
    {
      id: 'jobs',
      label: 'My Jobs',
      icon: <Briefcase />,
      content: <JobsList />
    },
    {
      id: 'saved',
      label: 'Saved',
      content: <SavedJobs />
    },
  ]}
/>
```

---

### Modal
**File**: `src/components/ui/Modal.tsx`

Dialog component rendered to portal with backdrop and close button.

**Sizes**: `sm`, `md`, `lg`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
}
```

**Usage**:
```tsx
const [open, setOpen] = useState(false);

return (
  <>
    <Button onClick={() => setOpen(true)}>Open</Button>

    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Confirm Action"
      size="md"
    >
      <p>Are you sure?</p>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
    </Modal>
  </>
);
```

---

### Toast
**File**: `src/components/ui/Toast.tsx`

Toast notification system with provider and hook.

**Types**: `success`, `error`, `info`

**Setup** (in root layout):
```tsx
import { ToastProvider } from '@/components/ui/Toast';

export default function RootLayout() {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
```

**Usage**:
```tsx
import { useToast } from '@/components/ui/Toast';

export function MyComponent() {
  const { addToast } = useToast();

  return (
    <button onClick={() => {
      addToast('Job applied successfully!', 'success', 3000);
    }}>
      Apply
    </button>
  );
}
```

---

### Skeleton
**File**: `src/components/ui/Skeleton.tsx`

Animated loading placeholder component.

**Variants**: `text`, `circle`, `rect`

**Props**:
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;  // Render multiple skeletons
}
```

**Usage**:
```tsx
<Skeleton variant="circle" width="48px" height="48px" />

<Skeleton variant="text" count={3} />

<Skeleton variant="rect" width="100%" height="200px" />
```

---

### EmptyState
**File**: `src/components/ui/EmptyState.tsx`

Empty state component with icon, message, and optional action.

**Variants**: `centered`, `compact`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'centered' | 'compact';
}
```

**Usage**:
```tsx
<EmptyState
  icon={Briefcase}
  title="No jobs found"
  description="Try adjusting your filters."
  action={{
    label: 'Clear Filters',
    onClick: handleClearFilters,
  }}
/>
```

---

## Job Components

### JobCard
**File**: `src/components/jobs/JobCard.tsx`

Individual job listing with company info, type badges, and apply button.

**Props**:
```typescript
interface JobCardProps {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  jobType: 'full-time' | 'contract' | 'freelance';
  salaryMin?: number;
  salaryMax?: number;
  techStack: string[];              // Max 5 shown, rest as "+X"
  postedAt: Date;
  featured?: boolean;               // Adds indigo left border
  onApply?: () => void;
}
```

**Features**:
- Company logo and name
- Job title
- Location type badge
- Job type badge
- Salary range
- Tech stack (max 5, with overflow indicator)
- Time posted (relative)
- Featured state styling
- Apply button

**Usage**:
```tsx
<JobCard
  id="job-1"
  companyName="Acme Corp"
  companyLogo="/logos/acme.png"
  jobTitle="Senior React Developer"
  locationType="remote"
  jobType="full-time"
  salaryMin={120000}
  salaryMax={160000}
  techStack={['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'PostgreSQL']}
  postedAt={new Date()}
  featured={true}
  onApply={() => console.log('Apply clicked')}
/>
```

---

### JobList
**File**: `src/components/jobs/JobList.tsx`

Container for rendering multiple JobCards with loading and empty states.

**Props**:
```typescript
interface JobListProps {
  jobs: JobCardProps[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onJobApply?: (jobId: string) => void;
}
```

**Usage**:
```tsx
<JobList
  jobs={jobsData}
  isLoading={isLoading}
  isEmpty={jobs.length === 0}
  onJobApply={(jobId) => handleApply(jobId)}
/>
```

---

### JobFilters
**File**: `src/components/jobs/JobFilters.tsx`

Filter panel with expandable sections for refining job search.

**Filters**:
- Job Type (checkboxes: Full-time, Contract, Freelance)
- Experience Level (Junior, Mid, Senior, Lead)
- Location Type (Remote, On-site, Hybrid)
- Salary Range (dual range slider)

**Props**:
```typescript
interface JobFiltersProps {
  onFilterChange: (filters: {
    jobTypes: string[];
    experienceLevel: string[];
    locationTypes: string[];
    techStack: string[];
    salaryRange: [number, number];
  }) => void;
}
```

**Usage**:
```tsx
<JobFilters
  onFilterChange={(filters) => {
    console.log('Applied filters:', filters);
    setFilters(filters);
  }}
/>
```

---

### CompanyCard
**File**: `src/components/jobs/CompanyCard.tsx`

Company profile preview card with stats and CTA.

**Props**:
```typescript
interface CompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  size: string;              // e.g., "Series B", "50-200 employees"
  industry: string;
  missionExcerpt: string;
  activeJobCount: number;
  onViewJobs?: () => void;
}
```

**Usage**:
```tsx
<CompanyCard
  id="company-1"
  name="Christian Tech Startup"
  logo="/logos/startup.png"
  size="Series A"
  industry="SaaS"
  missionExcerpt="Building software that glorifies God..."
  activeJobCount={5}
  onViewJobs={() => navigate('/company/1/jobs')}
/>
```

---

## Community Components

### ForumPostCard
**File**: `src/components/community/ForumPostCard.tsx`

Forum discussion post preview with upvoting and reply count.

**Props**:
```typescript
interface ForumPostCardProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  title: string;
  bodyExcerpt: string;
  category: string;
  tags: string[];
  upvoteCount: number;
  replyCount: number;
  postedAt: Date;
  onPostClick?: () => void;
  onUpvote?: () => void;
  userUpvoted?: boolean;
}
```

**Features**:
- Author avatar
- Post title
- Excerpt text
- Category badge
- Tag badges
- Upvote button (with count)
- Reply count
- Time posted
- Click to open full post

**Usage**:
```tsx
<ForumPostCard
  id="post-1"
  authorName="Sarah Johnson"
  authorInitials="SJ"
  title="How to balance work and faith?"
  bodyExcerpt="I've been struggling with maintaining..."
  category="Career Advice"
  tags={['work-life-balance', 'faith']}
  upvoteCount={42}
  replyCount={12}
  postedAt={new Date()}
  onPostClick={() => navigate('/post/1')}
  onUpvote={() => upvotePost('post-1')}
/>
```

---

### ForumReply
**File**: `src/components/community/ForumReply.tsx`

Comment reply in a forum thread with nested support.

**Props**:
```typescript
interface ForumReplyProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  authorIsOp?: boolean;      // Original Poster badge
  body: string;
  upvoteCount: number;
  postedAt: Date;
  depth?: number;            // For nesting
  onReply?: () => void;
  onDelete?: () => void;
  onUpvote?: () => void;
  userUpvoted?: boolean;
  isAuthor?: boolean;        // Show delete button
  children?: React.ReactNode; // Nested replies
}
```

**Features**:
- Author info with optional OP badge
- Reply body
- Upvote button
- Reply button
- Delete button (if author)
- Nested reply support (indented)
- Time posted

**Usage**:
```tsx
<ForumReply
  id="reply-1"
  authorName="John Smith"
  authorInitials="JS"
  authorIsOp={true}
  body="Great question! Here's what I learned..."
  upvoteCount={28}
  postedAt={new Date()}
  depth={1}
  onReply={() => setReplyingTo('reply-1')}
  onDelete={() => deleteReply('reply-1')}
  onUpvote={() => upvoteReply('reply-1')}
  isAuthor={true}
>
  {/* Nested replies here */}
</ForumReply>
```

---

### PrayerRequestCard
**File**: `src/components/community/PrayerRequestCard.tsx`

Prayer request card with "Pray" button and status indicator.

**Props**:
```typescript
interface PrayerRequestCardProps {
  id: string;
  title: string;
  body: string;
  prayerCount: number;
  status: 'active' | 'answered';
  isAnonymous?: boolean;
  createdAt: Date;
  onPray?: () => void;
  userPrayed?: boolean;
}
```

**Features**:
- Title and excerpt
- Prayer count with button
- Status badge (Active/Answered)
- Anonymous indicator
- Time created
- Pray button (disabled if already prayed)

**Usage**:
```tsx
<PrayerRequestCard
  id="prayer-1"
  title="Guidance for career change"
  body="I'm considering a new job opportunity and need wisdom..."
  prayerCount={45}
  status="active"
  isAnonymous={false}
  createdAt={new Date()}
  onPray={() => prayForRequest('prayer-1')}
/>
```

---

### MentorCard
**File**: `src/components/community/MentorCard.tsx`

Mentor profile card with skills and focus areas.

**Props**:
```typescript
interface MentorCardProps {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  title: string;
  experienceYears: number;
  skills: string[];
  focusAreas: string[];
  openToWork?: boolean;
  onRequestMentorship?: () => void;
}
```

**Features**:
- Avatar with "open to work" ring
- Name and title
- Years of experience
- Skills (max 4, +X overflow)
- Focus areas
- Request Mentorship button

**Usage**:
```tsx
<MentorCard
  id="mentor-1"
  name="David Chen"
  initials="DC"
  title="Engineering Manager"
  experienceYears={12}
  skills={['TypeScript', 'React', 'Node.js', 'System Design', 'Leadership']}
  focusAreas={['Career Growth', 'Technical Leadership', 'Work-Life Balance']}
  openToWork={true}
  onRequestMentorship={() => requestMentorship('mentor-1')}
/>
```

---

## Layout Components

### Header
**File**: `src/components/layout/Header.tsx`

Top navigation with logo, nav links, search, and auth buttons.

**Props**:
```typescript
interface HeaderProps {
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
  isAuthenticated?: boolean;
  userName?: string;
}
```

**Features**:
- Logo (CD icon + brand name)
- Navigation links (Jobs, Community, Mentorship, Prayer)
- Search bar (hidden on mobile)
- Auth buttons (Sign In / Join Us or Sign Out)
- Mobile hamburger menu

**Usage**:
```tsx
<Header
  onSearch={(query) => handleSearch(query)}
  onNavigate={(path) => router.push(path)}
  isAuthenticated={true}
  userName="John Doe"
/>
```

---

### Footer
**File**: `src/components/layout/Footer.tsx`

Footer with verse of the day, community stats, and links.

**Props**:
```typescript
interface FooterProps {
  stats?: FooterStats;
  verseOfTheDay?: {
    text: string;
    reference: string;
  };
}

interface FooterStats {
  totalMembers?: number;
  jobsPosted?: number;
  prayerRequests?: number;
}
```

**Features**:
- Verse of the Day section
- Community statistics
- Link sections (Product, Company, Legal)
- Social media links
- Copyright info

**Usage**:
```tsx
<Footer
  stats={{
    totalMembers: 5240,
    jobsPosted: 342,
    prayerRequests: 1203,
  }}
  verseOfTheDay={{
    text: 'Therefore, as God\'s chosen people...',
    reference: 'Colossians 3:12',
  }}
/>
```

---

### Sidebar
**File**: `src/components/layout/Sidebar.tsx`

Community sidebar with forum categories, trending tags, and featured prayer requests.

**Props**:
```typescript
interface SidebarProps {
  categories?: SidebarCategory[];
  trendingTags?: TrendingTag[];
  featuredPrayerRequests?: FeaturedPrayerRequest[];
  onCategoryClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onPrayerRequestClick?: (id: string) => void;
}

interface SidebarCategory {
  id: string;
  name: string;
  postCount?: number;
  color?: string;
}

interface TrendingTag {
  id: string;
  name: string;
  count: number;
}

interface FeaturedPrayerRequest {
  id: string;
  title: string;
  prayerCount: number;
}
```

**Features**:
- Forum categories (with post counts)
- Trending tags
- Featured prayer requests
- Community highlights

**Usage**:
```tsx
<Sidebar
  categories={categoriesData}
  trendingTags={tagsData}
  featuredPrayerRequests={prayersData}
  onCategoryClick={(id) => filterByCategory(id)}
  onTagClick={(tag) => searchByTag(tag)}
  onPrayerRequestClick={(id) => navigate(`/prayer/${id}`)}
/>
```

---

## Import Patterns

### Import from index files:
```tsx
// UI Components
import { Button, Input, Badge, Avatar } from '@/components/ui';

// Job Components
import { JobCard, JobList, JobFilters, CompanyCard } from '@/components/jobs';

// Community Components
import { ForumPostCard, ForumReply, PrayerRequestCard, MentorCard } from '@/components/community';

// Layout Components
import { Header, Footer, Sidebar } from '@/components/layout';
```

### Import specific components:
```tsx
import Button from '@/components/ui/Button';
import JobCard from '@/components/jobs/JobCard';
```

---

## Best Practices

### Type Safety
All components are fully typed with TypeScript interfaces. Always import and use the provided types:

```tsx
import Button, { type ButtonProps } from '@/components/ui/Button';

const MyComponent: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Accessibility
- All components include proper ARIA attributes
- Keyboard navigation support
- Focus states for interactive elements
- Semantic HTML

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm`, `md`, `lg`, `xl`
- Hidden elements on small screens (e.g., Header search, nav)
- Responsive grid layouts in multi-column components

### Performance
- Use `React.forwardRef` for ref forwarding
- Memoization where appropriate
- Lazy loading for images
- Portal rendering for modals/toasts

---

## File Structure Summary

Total: **27 files** (21 component files + 5 index files + 1 documentation)

**UI Components** (10):
- Input, Select, Button, Card, Badge, Avatar, Tabs, Modal, Toast, Skeleton, EmptyState

**Job Components** (4):
- JobCard, JobList, JobFilters, CompanyCard

**Community Components** (4):
- ForumPostCard, ForumReply, PrayerRequestCard, MentorCard

**Layout Components** (3):
- Header, Footer, Sidebar

---

## Customization Guide

### Brand Colors
Update Tailwind config for different indigo shade:
```tailwind
colors: {
  brand: {
    50: '#f0f1ff',
    500: '#4F46E5',  // Royal Indigo
    600: '#4338ca',
    700: '#3730a3',
  }
}
```

### Font
Currently using `font-[Instrument_Sans]`. Update in Tailwind config:
```tailwind
fontFamily: {
  sans: ['Instrument Sans', 'system-ui'],
}
```

### Component Theming
Components use hardcoded Tailwind classes. For theme switching, implement CSS variables:
```css
@layer base {
  :root {
    --color-brand: #4F46E5;
    --color-error: #dc2626;
  }
}
```

---

All components are production-ready, fully typed, accessible, and optimized for the Christian Developers platform.
