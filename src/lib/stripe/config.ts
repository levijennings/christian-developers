/**
 * Christian Developers Stripe Configuration
 * Plans, pricing, features, and plan limits
 */

import { Plan, PlanTier } from "@/lib/stripe/types";

export const CHRISTIAN_DEVELOPERS_PLANS: Plan[] = [
  {
    id: "community",
    name: "Community",
    description: "For job seekers just getting started",
    tier: "community",
    app: "christian-developers",
    monthlyPrice: 0,
    currency: "USD",
    billingCycle: "free",
    stripeProductId: "",
    stripePriceIds: {
      oneTime: "",
    },
    features: [
      {
        id: "job_browse",
        name: "Browse Jobs",
        description: "Access all job listings",
        included: true,
      },
      {
        id: "basic_profile",
        name: "Basic Profile",
        description: "Create and manage your profile",
        included: true,
      },
      {
        id: "applications",
        name: "Applications Per Month",
        description: "Limited applications",
        included: true,
        limit: 5,
      },
      {
        id: "featured_profile",
        name: "Featured Profile",
        description: "Get highlighted to employers",
        included: false,
      },
      {
        id: "mentor_matching",
        name: "Mentor Matching",
        description: "Connect with Christian mentors",
        included: false,
      },
      {
        id: "prayer_groups",
        name: "Prayer Groups",
        description: "Join community prayer groups",
        included: false,
      },
      {
        id: "priority_support",
        name: "Priority Support",
        description: "Faster response times",
        included: false,
      },
    ],
    limits: {
      maxApplications: 5,
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For active job seekers",
    tier: "pro",
    app: "christian-developers",
    monthlyPrice: 900, // $9/month
    annualPrice: 8900, // $89/year
    currency: "USD",
    billingCycle: "monthly",
    popular: true,
    stripeProductId: "",
    stripePriceIds: {
      monthly: "",
      annual: "",
    },
    features: [
      {
        id: "job_browse",
        name: "Browse Jobs",
        description: "Access all job listings",
        included: true,
      },
      {
        id: "basic_profile",
        name: "Enhanced Profile",
        description: "Get highlighted with Pro badge",
        included: true,
      },
      {
        id: "applications",
        name: "Unlimited Applications",
        description: "Apply to unlimited jobs",
        included: true,
      },
      {
        id: "featured_profile",
        name: "Featured Profile",
        description: "Get highlighted to employers",
        included: true,
      },
      {
        id: "mentor_matching",
        name: "Mentor Matching",
        description: "Connect with Christian mentors",
        included: true,
      },
      {
        id: "prayer_groups",
        name: "Prayer Groups",
        description: "Join community prayer groups",
        included: true,
      },
      {
        id: "priority_support",
        name: "Priority Support",
        description: "Email support within 24 hours",
        included: false,
      },
    ],
  },
  {
    id: "employer",
    name: "Employer",
    description: "For Christian companies hiring",
    tier: "employer",
    app: "christian-developers",
    monthlyPrice: 9900, // $99/month
    annualPrice: 99000, // $990/year
    currency: "USD",
    billingCycle: "monthly",
    stripeProductId: "",
    stripePriceIds: {
      monthly: "",
      annual: "",
    },
    features: [
      {
        id: "job_posts",
        name: "Job Posts",
        description: "Unlimited job listings",
        included: true,
      },
      {
        id: "applicant_tracking",
        name: "Applicant Tracking",
        description: "Built-in ATS for managing applications",
        included: true,
      },
      {
        id: "featured_listings",
        name: "Featured Job Listings",
        description: "Get priority placement in search",
        included: true,
      },
      {
        id: "company_page",
        name: "Company Page",
        description: "Showcase your company culture and values",
        included: true,
      },
      {
        id: "candidate_screening",
        name: "Candidate Screening Tools",
        description: "Filter and rate candidates",
        included: true,
      },
      {
        id: "bulk_posting",
        name: "Bulk Job Posting",
        description: "Post multiple jobs at once",
        included: true,
      },
      {
        id: "analytics",
        name: "Hiring Analytics",
        description: "View application and hiring metrics",
        included: true,
      },
      {
        id: "priority_support",
        name: "Priority Support",
        description: "Dedicated support + phone access",
        included: true,
      },
    ],
  },
];

export const PLAN_LIMITS: Record<PlanTier, Record<string, number>> = {
  community: {
    maxApplications: 5,
  },
  pro: {
    maxApplications: Infinity,
  },
  employer: {
    maxJobPosts: Infinity,
  },
  starter: {},
  professional: {},
  enterprise: {},
};

export const FEATURE_GATES: Record<PlanTier, Record<string, boolean>> = {
  community: {
    job_browse: true,
    basic_profile: true,
    featured_profile: false,
    mentor_matching: false,
    prayer_groups: false,
    priority_support: false,
  },
  pro: {
    job_browse: true,
    basic_profile: true,
    featured_profile: true,
    mentor_matching: true,
    prayer_groups: true,
    priority_support: false,
  },
  employer: {
    job_posting: true,
    applicant_tracking: true,
    featured_listings: true,
    company_page: true,
    candidate_screening: true,
    bulk_posting: true,
    analytics: true,
    priority_support: true,
  },
  starter: {},
  professional: {},
  enterprise: {},
};

/**
 * Get plan by tier
 */
export function getPlanByTier(tier: PlanTier): Plan | undefined {
  return CHRISTIAN_DEVELOPERS_PLANS.find((plan) => plan.tier === tier);
}

/**
 * Get all available plans
 */
export function getAvailablePlans(): Plan[] {
  return CHRISTIAN_DEVELOPERS_PLANS.filter(
    (plan) => plan.stripePriceIds.monthly || plan.monthlyPrice === 0
  );
}

/**
 * Check if feature is available in plan
 */
export function hasFeature(tier: PlanTier, feature: string): boolean {
  return FEATURE_GATES[tier]?.[feature] ?? false;
}

/**
 * Get limit for a specific tier
 */
export function getLimit(tier: PlanTier, limitType: string): number {
  return PLAN_LIMITS[tier]?.[limitType] ?? 0;
}

/**
 * Check if plan has reached limit
 */
export function isAtLimit(tier: PlanTier, limitType: string, currentValue: number): boolean {
  const limit = getLimit(tier, limitType);
  return limit !== Infinity && currentValue >= limit;
}

/**
 * Get upgrade path for current plan
 */
export function getUpgradePath(currentTier: PlanTier): Plan | undefined {
  const jobSeekerTiers: PlanTier[] = ["community", "pro"];
  const currentIndex = jobSeekerTiers.indexOf(currentTier);
  if (currentIndex === -1 || currentIndex === jobSeekerTiers.length - 1) {
    return undefined;
  }
  return getPlanByTier(jobSeekerTiers[currentIndex + 1]);
}

/**
 * Get downgrade path for current plan
 */
export function getDowngradePath(currentTier: PlanTier): Plan | undefined {
  const jobSeekerTiers: PlanTier[] = ["community", "pro"];
  const currentIndex = jobSeekerTiers.indexOf(currentTier);
  if (currentIndex <= 0) {
    return undefined;
  }
  return getPlanByTier(jobSeekerTiers[currentIndex - 1]);
}

export default {
  CHRISTIAN_DEVELOPERS_PLANS,
  PLAN_LIMITS,
  FEATURE_GATES,
  getPlanByTier,
  getAvailablePlans,
  hasFeature,
  getLimit,
  isAtLimit,
  getUpgradePath,
  getDowngradePath,
};
