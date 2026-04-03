import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { companySchema, paginationSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  parsePagination,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';
import { z } from 'zod';

const listCompaniesSchema = z.object({
  industry: z.string().optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  faith_alignment: z
    .enum(['christian-owned', 'christian-values', 'multi-faith', 'secular'])
    .optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = listCompaniesSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    const supabase = createClient();
    let baseQuery = supabase
      .from('companies')
      .select(
        `*,
        active_jobs:job_listings(count)`,
        { count: 'exact' }
      )
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (parsed.data.industry) {
      baseQuery = baseQuery.eq('industry', parsed.data.industry);
    }

    if (parsed.data.size) {
      baseQuery = baseQuery.eq('size', parsed.data.size);
    }

    if (parsed.data.faith_alignment) {
      baseQuery = baseQuery.eq('faith_alignment', parsed.data.faith_alignment);
    }

    if (parsed.data.search) {
      baseQuery = baseQuery.or(
        `name.ilike.%${parsed.data.search}%,description.ilike.%${parsed.data.search}%`
      );
    }

    const { data, error, count } = await baseQuery.range(offset, offset + limit - 1);

    if (error) throw error;

    return createSuccessResponse(
      {
        companies: data || [],
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
    console.error('GET /api/companies error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: compData, error: validationError } = await validateRequest(
      request,
      companySchema
    );
    if (validationError) return validationError;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('companies')
      .insert([
        {
          owner_id: user!.id,
          name: compData.name,
          description: compData.description,
          website_url: compData.website_url,
          size: compData.size,
          industry: compData.industry,
          mission_statement: compData.mission_statement,
          faith_alignment: compData.faith_alignment,
          logo_url: compData.logo_url,
          is_verified: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(
      data,
      'Company profile created. Verification pending.',
      201
    );
  } catch (error) {
    console.error('POST /api/companies error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const POST = asyncHandler(POST);
