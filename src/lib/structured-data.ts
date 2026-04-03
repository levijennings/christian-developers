import { JobListing, Company } from '@/types'

export function generateJobPostingSchema(job: JobListing, company: Company) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    validThrough: job.expires_at,
    employmentType: job.job_type.toUpperCase().replace('_', ''),
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      sameAs: company.website_url,
      logo: company.logo_url,
    },
    jobLocationType: job.location_type === 'remote' ? 'TELECOMMUTE' : undefined,
    jobLocation: job.location ? {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    } : undefined,
    baseSalary: job.salary_min ? {
      '@type': 'MonetaryAmount',
      currency: job.salary_currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: 'YEAR',
      },
    } : undefined,
    skills: job.tech_stack.join(', '),
  }
}
