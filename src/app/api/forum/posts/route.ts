import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { forumPostSchema } from '@/lib/validations';
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

const listPostsSchema = z.object({
  category_id: z.string().uuid().optional(),
  sort: z.enum(['recent', 'popular']).optional().default('recent'),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = listPostsSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    const supabase = createClient();
    let baseQuery = supabase
      .from('forum_posts')
      .select(
        `*,
        author:profiles(id, display_name, avatar_url),
        category:forum_categories(id, name),
        replies_count:forum_replies(count),
        upvotes_count:upvotes(count)`,
        { count: 'exact' }
      );

    if (parsed.data.category_id) {
      baseQuery = baseQuery.eq('category_id', parsed.data.category_id);
    }

    if (parsed.data.search) {
      baseQuery = baseQuery.or(
        `title.ilike.%${parsed.data.search}%,body.ilike.%${parsed.data.search}%`
      );
    }

    const orderField = parsed.data.sort === 'popular' ? 'upvotes_count' : 'created_at';
    const orderDir = parsed.data.sort === 'popular' ? 'descending' : 'descending';

    const { data, error, count } = await baseQuery
      .order(orderField, { ascending: orderDir === 'ascending' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return createSuccessResponse(
      {
        posts: data || [],
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
    console.error('GET /api/forum/posts error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: postData, error: validationError } = await validateRequest(
      request,
      forumPostSchema
    );
    if (validationError) return validationError;

    const supabase = createClient();

    // Verify category exists
    const { data: category, error: catError } = await supabase
      .from('forum_categories')
      .select('id')
      .eq('id', postData.category_id)
      .single();

    if (catError || !category) {
      return createErrorResponse('Forum category not found', 404);
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .insert([
        {
          author_id: user!.id,
          category_id: postData.category_id,
          title: postData.title,
          body: postData.body,
          tags: postData.tags || [],
        },
      ])
      .select(
        `*,
        author:profiles(id, display_name, avatar_url),
        category:forum_categories(id, name)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Forum post created', 201);
  } catch (error) {
    console.error('POST /api/forum/posts error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const POST = asyncHandler(POST);
