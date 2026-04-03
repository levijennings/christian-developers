import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mentorshipStatusSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  isMentorshipParticipant,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pairId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: statusData, error: validationError } = await validateRequest(
      request,
      mentorshipStatusSchema
    );
    if (validationError) return validationError;

    // Verify user is participant
    const isParticipant = await isMentorshipParticipant(user!.id, pairId);
    if (!isParticipant) {
      return createErrorResponse('You are not part of this mentorship pair', 403);
    }

    const supabase = createClient();

    // Get current pair
    const { data: pair, error: pairError } = await supabase
      .from('mentorship_pairs')
      .select('*')
      .eq('id', pairId)
      .single();

    if (pairError || !pair) {
      return createErrorResponse('Mentorship pair not found', 404);
    }

    // Handle status transitions
    let updateData: any = { status: statusData.status };

    if (statusData.status === 'accepted') {
      // Only mentor can accept
      if (pair.mentor_id !== user!.id) {
        return createErrorResponse('Only the mentor can accept a mentorship request', 403);
      }
      updateData.status = 'active';
      updateData.accepted_at = new Date().toISOString();
    } else if (statusData.status === 'declined') {
      // Only mentor can decline
      if (pair.mentor_id !== user!.id) {
        return createErrorResponse('Only the mentor can decline a mentorship request', 403);
      }
      updateData.status = 'declined';
    } else if (statusData.status === 'completed') {
      // Either party can complete
      updateData.status = 'completed';
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('mentorship_pairs')
      .update(updateData)
      .eq('id', pairId)
      .select(
        `*,
        mentor:profiles!mentor_id(id, display_name, avatar_url, title),
        mentee:profiles!mentee_id(id, display_name, avatar_url, title)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Mentorship status updated');
  } catch (error) {
    console.error('PATCH /api/mentorship/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const PATCH = asyncHandler(PATCH);
