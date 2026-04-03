import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Community',
    price: 0,
    features: ['Browse job listings', 'Community forum access', 'Basic profile', 'Prayer request board'],
  },
  pro: {
    name: 'Pro',
    price: 9,
    interval: 'month' as const,
    features: ['Priority job applications', 'Mentorship matching', 'Featured profile', 'Direct messaging', 'Resume builder'],
  },
  employer: {
    name: 'Employer',
    price: 99,
    interval: 'month' as const,
    features: ['Post unlimited jobs', 'Candidate search', 'Company profile page', 'Analytics dashboard', 'Featured listings'],
  },
} as const
