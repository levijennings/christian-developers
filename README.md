# Christian Developers - Faith-Driven Tech Community & Job Board

A fully scaffolded Next.js 14 project with TypeScript, Tailwind CSS, Supabase authentication, and Stripe payment integration.

## Project Structure

```
christian-developers/
├── src/
│   ├── app/
│   │   ├── globals.css           # Global Tailwind styles
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── page.tsx              # Landing page
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   ├── server.ts         # Server Supabase client
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── stripe.ts             # Stripe configuration and plans
│   │   └── structured-data.ts    # Schema.org helpers
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── middleware.ts             # Next.js middleware
├── .env.example                  # Environment variables template
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies and scripts
```

## Features

- **Next.js 14** with TypeScript
- **Tailwind CSS** with custom branding colors (Royal Indigo)
- **Supabase** authentication with middleware protection
- **Stripe** integration with 3 pricing tiers (Community, Pro, Employer)
- **ESLint** and **Prettier** for code quality
- **Type-safe** data models for jobs, companies, users, mentorships, forum posts, and prayer requests
- **SEO-optimized** with structured data helpers

## Available Scripts

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint TypeScript and Next.js
npm run lint
```

## Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your configuration values:
   - **Supabase**: Get from your Supabase project settings
   - **Stripe**: Get from your Stripe dashboard
   - **App URL**: Update for your environment (defaults to http://localhost:3000)

## Pricing Plans

The application supports three tiers:

- **Community (Free)**: Basic access to job listings and forums
- **Pro ($9/month)**: Priority applications, mentorship, featured profile
- **Employer ($99/month)**: Unlimited job postings, candidate search, analytics

## Type Definitions

All major entities are defined with TypeScript interfaces:

- `JobListing`: Job postings with tech stack, salary, location
- `Company`: Employer profiles with mission statements
- `UserProfile`: Developer profiles with skills and experience
- `MentorshipPair`: Mentorship relationships
- `ForumPost`: Community forum discussions
- `PrayerRequest`: Prayer request sharing

## Supabase Integration

Three client implementations:

- **Client** (`src/lib/supabase/client.ts`): Browser-side authentication
- **Server** (`src/lib/supabase/server.ts`): Server-side operations
- **Middleware** (`src/lib/supabase/middleware.ts`): Session management

## Build Status

The project builds successfully with no TypeScript errors and includes:
- Static page generation for landing page
- Middleware for authentication
- Full type safety

Generated output sizes:
- Home page: 138 B
- First Load JS: 87.4 kB
- Middleware: 76.3 kB

## Next Steps

1. Set up Supabase database schema
2. Configure authentication flows
3. Create additional pages (jobs, auth, dashboard)
4. Set up Stripe webhook endpoints
5. Build forum and prayer request components
6. Implement mentorship matching system

## Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.3
- **Database**: Supabase
- **Payments**: Stripe
- **Package Manager**: npm
