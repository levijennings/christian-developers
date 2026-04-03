import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { forumPostSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  requirePostAuthor,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('forum_posts')
      .select(
        `*,
        author:profiles(id, display_name, avatar_url, title, bio),
        category:forum_categories(id, name),
        replies:forum_replies(
          *,
          author:profiles(id, display_name, avatar_url),
          upvotes_count:upvotes(count)
        ),
        upvotes_count:upvotes(count)`
      )
      .eq('id', postId)
      .single();

    if (error || !data) {
      return createErrorResponse('Forum post not found', 404);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/forum/posts/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: updateData, error: validationError } = await validateRequest(
      request,
      forumPostSchema.partial()
    );
    if (validationError) return validationError;

    // Verify authorship
    const isAuthor = await requirePostAuthor(user!.id, postId);
    if (!isAuthor) {
      return createErrorResponse('You are not the author of this post', 403);
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('forum_posts')
      .update(updateData)
      .eq('id', postId)
      .select(
        `*,
        author:profiles(id, display_name, avatar_url),
        category:forum_categories(id, name)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Forum post updated');
  } catch (error) {
    console.error('PATCH /api/forum/posts/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    // Verify authorship
    const isAuthor = await requirePostAuthor(user!.id, postId);
    if (!isAuthor) {
      return createErrorResponse('You are not the author of this post', 403);
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('forum_posts')
      .update({ is_deleted: true })
      .eq('id', postId);

    if (error) throw error;

    return createSuccessResponse(null, 'Forum post deleted');
  } catch (error) {
    console.error('DELETE /api/forum/posts/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const PATCH = asyncHandler(PATCH);
export const DELETE = asyncHandler(DELETE);
