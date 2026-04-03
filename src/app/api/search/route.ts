import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  parsePagination,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = searchSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    if (!parsed.data.q) {
      return createErrorResponse('Search query is required', 400);
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    const supabase = createClient();
    const searchTerm = parsed.data.q.toLowerCase();

    let results: any = {
      jobs: [],
      profiles: [],
      posts: [],
    };

    // Search jobs
    if (!parsed.data.type || parsed.data.type === 'jobs') {
      const { data: jobs, error: jobError } = await supabase
        .from('job_listings')
        .select(
          `id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          company:companies(id, name, logo_url)`
        )
        .eq('is_active', true)
        .or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,requirements.ilike.%${searchTerm}%`
        )
        .limit(parsed.data.limit);

      if (!jobError && jobs) {
        results.jobs = jobs;
      }
    }

    // Search profiles
    if (!parsed.data.type || parsed.data.type === 'profiles') {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select(
          `id,
          display_name,
          avatar_url,
          title,
          bio,
          skills,
          location`
        )
        .or(`display_name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
        .limit(parsed.data.limit);

      if (!profileError && profiles) {
        results.profiles = profiles;
      }
    }

    // Search forum posts
    if (!parsed.data.type || parsed.data.type === 'posts') {
      const { data: posts, error: postError } = await supabase
        .from('forum_posts')
        .select(
          `id,
          title,
          body,
          created_at,
          author:profiles(id, display_name, avatar_url),
          category:forum_categories(id, name),
          upvotes_count:upvotes(count),
          replies_count:forum_replies(count)`
        )
        .eq('is_deleted', false)
        .or(`title.ilike.%${searchTerm}%,body.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
        .limit(parsed.data.limit);

      if (!postError && posts) {
        results.posts = posts;
      }
    }

    return createSuccessResponse(
      {
        results,
        query: parsed.data.q,
        pagination: {
          page,
          limit,
        },
      },
      undefined,
      200
    );
  } catch (error) {
    console.error('GET /api/search error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
