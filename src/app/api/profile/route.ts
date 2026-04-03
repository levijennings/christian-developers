import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileUpdateSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (error || !data) {
      return createErrorResponse('Profile not found', 404);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function PATCH(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: updateData, error: validationError } = await validateRequest(
      request,
      profileUpdateSchema
    );
    if (validationError) return validationError;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user!.id)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Profile updated');
  } catch (error) {
    console.error('PATCH /api/profile error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const PATCH = asyncHandler(PATCH);
