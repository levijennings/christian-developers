import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { forumReplySchema } from '@/lib/validations';
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

const listRepliesSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const parsed = listRepliesSchema.safeParse(query);
    if (!parsed.success) {
      return createErrorResponse('Invalid query parameters', 400, parsed.error.flatten());
    }

    const { page, limit, offset } = parsePagination(
      query.page?.toString(),
      query.limit?.toString()
    );

    // Verify post exists
    const supabase = createClient();
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return createErrorResponse('Forum post not found', 404);
    }

    const { data, error, count } = await supabase
      .from('forum_replies')
      .select(
        `*,
        author:profiles(id, display_name, avatar_url),
        upvotes_count:upvotes(count)`,
        { count: 'exact' }
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return createSuccessResponse(
      {
        replies: data || [],
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
    console.error('GET /api/forum/posts/[id]/replies error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: replyData, error: validationError } = await validateRequest(
      request,
      forumReplySchema
    );
    if (validationError) return validationError;

    // Verify post exists
    const supabase = createClient();
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return createErrorResponse('Forum post not found', 404);
    }

    // If parent_reply_id provided, verify it exists and is in this post
    if (replyData.parent_reply_id) {
      const { data: parentReply, error: parentError } = await supabase
        .from('forum_replies')
        .select('id')
        .eq('id', replyData.parent_reply_id)
        .eq('post_id', postId)
        .single();

      if (parentError || !parentReply) {
        return createErrorResponse('Parent reply not found', 404);
      }
    }

    const { data, error } = await supabase
      .from('forum_replies')
      .insert([
        {
          post_id: postId,
          author_id: user!.id,
          body: replyData.body,
          parent_reply_id: replyData.parent_reply_id,
        },
      ])
      .select(
        `*,
        author:profiles(id, display_name, avatar_url)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Reply created', 201);
  } catch (error) {
    console.error('POST /api/forum/posts/[id]/replies error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const POST = asyncHandler(POST);
