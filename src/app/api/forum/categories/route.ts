import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSuccessResponse, formatDatabaseError, asyncHandler } from '@/lib/api-helpers';

async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('forum_categories')
      .select(
        `*,
        posts_count:forum_posts(count)`
      )
      .order('created_at', { ascending: true });

    if (error) throw error;

    return createSuccessResponse(
      {
        categories: data || [],
      },
      undefined,
      200
    );
  } catch (error) {
    console.error('GET /api/forum/categories error:', error);
    return createSuccessResponse(
      { categories: [] },
      'Failed to fetch categories',
      500
    );
  }
}

export const GET = asyncHandler(GET);
