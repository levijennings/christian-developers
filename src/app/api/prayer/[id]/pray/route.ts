import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createErrorResponse,
  createSuccessResponse,
  requireAuth,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prayerId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const supabase = createClient();

    // Verify prayer request exists
    const { data: prayer, error: prayerError } = await supabase
      .from('prayer_requests')
      .select('id, is_active')
      .eq('id', prayerId)
      .single();

    if (prayerError || !prayer) {
      return createErrorResponse('Prayer request not found', 404);
    }

    if (!prayer.is_active) {
      return createErrorResponse('This prayer request is no longer active', 410);
    }

    // Check if user already prayed for this
    const { data: existing } = await supabase
      .from('prayers')
      .select('id')
      .eq('prayer_request_id', prayerId)
      .eq('user_id', user!.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return createErrorResponse('You have already prayed for this request', 409);
    }

    // Record the prayer
    const { data, error } = await supabase
      .from('prayers')
      .insert([
        {
          prayer_request_id: prayerId,
          user_id: user!.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Get updated prayer count
    const { data: updated, error: countError } = await supabase
      .from('prayer_requests')
      .select(
        `*,
        requester:profiles(id, display_name, avatar_url),
        prayers_count:prayers(count)`
      )
      .eq('id', prayerId)
      .single();

    if (countError || !updated) throw countError;

    return createSuccessResponse(updated, 'Prayer recorded', 201);
  } catch (error) {
    console.error('POST /api/prayer/[id]/pray error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const POST = asyncHandler(POST);
