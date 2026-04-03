import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upvoteSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: upvoteData, error: validationError } = await validateRequest(
      request,
      upvoteSchema
    );
    if (validationError) return validationError;

    const supabase = createClient();

    // Verify item exists
    const table = upvoteData.item_type === 'post' ? 'forum_posts' : 'forum_replies';
    const { data: item, error: itemError } = await supabase
      .from(table)
      .select('id')
      .eq('id', upvoteData.item_id)
      .single();

    if (itemError || !item) {
      return createErrorResponse(`${upvoteData.item_type} not found`, 404);
    }

    // Check if already upvoted
    const { data: existing, error: checkError } = await supabase
      .from('upvotes')
      .select('id')
      .eq('user_id', user!.id)
      .eq('item_id', upvoteData.item_id)
      .eq('item_type', upvoteData.item_type)
      .single();

    if (!checkError && existing) {
      // Remove upvote (toggle off)
      const { error: deleteError } = await supabase
        .from('upvotes')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;

      return createSuccessResponse({ upvoted: false }, 'Upvote removed');
    } else {
      // Add upvote (toggle on)
      const { error: insertError } = await supabase.from('upvotes').insert([
        {
          user_id: user!.id,
          item_id: upvoteData.item_id,
          item_type: upvoteData.item_type,
        },
      ]);

      if (insertError) throw insertError;

      return createSuccessResponse({ upvoted: true }, 'Upvote added', 201);
    }
  } catch (error) {
    console.error('POST /api/upvote error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const POST = asyncHandler(POST);
