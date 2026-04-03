import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prayerRequestSchema } from '@/lib/validations';
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

const listPrayerSchema = z.object({
  sort: z.enum(['recent', 'most-prayed']).optional().default('recent'),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = listPrayerSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    const supabase = createClient();
    let baseQuery = supabase
      .from('prayer_requests')
      .select(
        `*,
        requester:profiles(id, display_name, avatar_url),
        prayers_count:prayers(count)`,
        { count: 'exact' }
      )
      .eq('is_active', true);

    const orderField = parsed.data.sort === 'most-prayed' ? 'prayers_count' : 'created_at';
    const orderDir = parsed.data.sort === 'most-prayed' ? 'descending' : 'descending';

    const { data, error, count } = await baseQuery
      .order(orderField, { ascending: orderDir === 'ascending' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return createSuccessResponse(
      {
        prayers: data || [],
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
    console.error('GET /api/prayer error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: prayerData, error: validationError } = await validateRequest(
      request,
      prayerRequestSchema
    );
    if (validationError) return validationError;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('prayer_requests')
      .insert([
        {
          requester_id: prayerData.is_anonymous ? null : user!.id,
          title: prayerData.title,
          body: prayerData.body,
          is_anonymous: prayerData.is_anonymous,
          is_active: true,
        },
      ])
      .select(
        `*,
        requester:profiles(id, display_name, avatar_url)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Prayer request created', 201);
  } catch (error) {
    console.error('POST /api/prayer error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const POST = asyncHandler(POST);
