import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mentorshipRequestSchema } from '@/lib/validations';
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

const listMentorshipSchema = z.object({
  role: z.enum(['mentor', 'mentee', 'all']).optional().default('all'),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = listMentorshipSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    const supabase = createClient();

    // If user is requesting their own pairs
    if (query.role !== 'all') {
      let baseQuery = supabase
        .from('mentorship_pairs')
        .select(
          `*,
          mentor:profiles!mentor_id(id, display_name, avatar_url, title, bio),
          mentee:profiles!mentee_id(id, display_name, avatar_url, title, bio)`,
          { count: 'exact' }
        );

      if (query.role === 'mentor') {
        baseQuery = baseQuery.eq('mentor_id', user!.id);
      } else if (query.role === 'mentee') {
        baseQuery = baseQuery.eq('mentee_id', user!.id);
      }

      const { data, error, count } = await baseQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return createSuccessResponse(
        {
          pairs: data || [],
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
    }

    // List available mentors
    const { data, error, count } = await supabase
      .from('profiles')
      .select(
        `*,
        mentee_pairs:mentorship_pairs!mentor_id(count)`,
        { count: 'exact' }
      )
      .eq('is_mentor_available', true)
      .neq('id', user!.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return createSuccessResponse(
      {
        mentors: data || [],
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
    console.error('GET /api/mentorship error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: reqData, error: validationError } = await validateRequest(
      request,
      mentorshipRequestSchema
    );
    if (validationError) return validationError;

    // Prevent self-mentorship
    if (reqData.mentor_id === user!.id) {
      return createErrorResponse('You cannot mentor yourself', 400);
    }

    const supabase = createClient();

    // Verify mentor exists and is available
    const { data: mentor, error: mentorError } = await supabase
      .from('profiles')
      .select('id, is_mentor_available')
      .eq('id', reqData.mentor_id)
      .single();

    if (mentorError || !mentor) {
      return createErrorResponse('Mentor not found', 404);
    }

    if (!mentor.is_mentor_available) {
      return createErrorResponse('This mentor is not currently available', 410);
    }

    // Check for existing pair
    const { data: existing } = await supabase
      .from('mentorship_pairs')
      .select('id')
      .eq('mentor_id', reqData.mentor_id)
      .eq('mentee_id', user!.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return createErrorResponse('Mentorship pair already exists', 409);
    }

    // Create mentorship pair (pending approval)
    const { data, error } = await supabase
      .from('mentorship_pairs')
      .insert([
        {
          mentor_id: reqData.mentor_id,
          mentee_id: user!.id,
          focus_areas: reqData.focus_areas,
          meeting_frequency: reqData.meeting_frequency,
          status: 'pending',
        },
      ])
      .select(
        `*,
        mentor:profiles!mentor_id(id, display_name, avatar_url, title),
        mentee:profiles!mentee_id(id, display_name, avatar_url, title)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Mentorship request created', 201);
  } catch (error) {
    console.error('POST /api/mentorship error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const POST = asyncHandler(POST);
