import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jobListingSchema, paginationSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  requireCompanyOwner,
  parsePagination,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';
import { z } from 'zod';

const listJobsSchema = z.object({
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance']).optional(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
  location_type: z.enum(['remote', 'hybrid', 'on-site']).optional(),
  tech_stack: z.string().optional(),
  salary_min: z.coerce.number().int().optional(),
  salary_max: z.coerce.number().int().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = listJobsSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    const supabase = createClient();
    let baseQuery = supabase
      .from('job_listings')
      .select(
        `*,
        company:companies(id, name, logo_url, website_url)`,
        { count: 'exact' }
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (parsed.data.type) {
      baseQuery = baseQuery.eq('job_type', parsed.data.type);
    }

    if (parsed.data.experience_level) {
      baseQuery = baseQuery.eq('experience_level', parsed.data.experience_level);
    }

    if (parsed.data.location_type) {
      baseQuery = baseQuery.eq('location_type', parsed.data.location_type);
    }

    if (parsed.data.salary_min) {
      baseQuery = baseQuery.gte('salary_max', parsed.data.salary_min);
    }

    if (parsed.data.salary_max) {
      baseQuery = baseQuery.lte('salary_min', parsed.data.salary_max);
    }

    if (parsed.data.tech_stack) {
      const techs = parsed.data.tech_stack.split(',').map((t) => t.trim());
      baseQuery = baseQuery.contains('tech_stack', techs);
    }

    if (parsed.data.search) {
      baseQuery = baseQuery.or(
        `title.ilike.%${parsed.data.search}%,description.ilike.%${parsed.data.search}%`
      );
    }

    const { data, error, count } = await baseQuery.range(offset, offset + limit - 1);

    if (error) throw error;

    return createSuccessResponse(
      {
        jobs: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      },
      undefined,
      200
    );
  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: jobData, error: validationError } = await validateRequest(
      request,
      jobListingSchema
    );
    if (validationError) return validationError;

    // Determine company_id
    let companyId = jobData.company_id;
    if (!companyId) {
      // Get user's company
      const supabase = createClient();
      const { data: companies, error: compError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user!.id)
        .limit(1);

      if (compError || !companies || companies.length === 0) {
        return createErrorResponse('You must create a company profile first', 400);
      }
      companyId = companies[0].id;
    } else {
      // Verify ownership
      const isOwner = await requireCompanyOwner(user!.id, companyId);
      if (!isOwner) {
        return createErrorResponse('You do not own this company', 403);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .insert([
        {
          company_id: companyId,
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements,
          job_type: jobData.job_type,
          experience_level: jobData.experience_level,
          location_type: jobData.location_type,
          salary_min: jobData.salary_min,
          salary_max: jobData.salary_max,
          tech_stack: jobData.tech_stack,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Job listing created', 201);
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const POST = asyncHandler(POST);
