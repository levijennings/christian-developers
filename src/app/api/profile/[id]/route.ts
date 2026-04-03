import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createErrorResponse,
  createSuccessResponse,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `id,
        display_name,
        avatar_url,
        title,
        bio,
        skills,
        location,
        github_url,
        linkedin_url,
        portfolio_url,
        testimony,
        created_at,
        is_mentor_available,
        mentee_pairs:mentorship_pairs!mentor_id(count),
        forum_posts:forum_posts(count)`
      )
      .eq('id', userId)
      .single();

    if (error || !data) {
      return createErrorResponse('Profile not found', 404);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/profile/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
