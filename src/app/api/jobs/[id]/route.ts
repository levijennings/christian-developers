import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jobListingSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  requireJobOwner,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .select(
        `*,
        company:companies(id, name, description, website_url, logo_url, size, industry, mission_statement, faith_alignment),
        applications_count:job_applications(count)`
      )
      .eq('id', jobId)
      .single();

    if (error || !data) {
      return createErrorResponse('Job listing not found', 404);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/jobs/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: updateData, error: validationError } = await validateRequest(
      request,
      jobListingSchema.partial()
    );
    if (validationError) return validationError;

    // Verify ownership
    const isOwner = await requireJobOwner(user!.id, jobId);
    if (!isOwner) {
      return createErrorResponse('You do not own this job listing', 403);
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Job listing updated');
  } catch (error) {
    console.error('PATCH /api/jobs/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    // Verify ownership
    const isOwner = await requireJobOwner(user!.id, jobId);
    if (!isOwner) {
      return createErrorResponse('You do not own this job listing', 403);
    }

    const supabase = createClient();
    const { error } = await supabase.from('job_listings').delete().eq('id', jobId);

    if (error) throw error;

    return createSuccessResponse(null, 'Job listing deleted');
  } catch (error) {
    console.error('DELETE /api/jobs/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const PATCH = asyncHandler(PATCH);
export const DELETE = asyncHandler(DELETE);
