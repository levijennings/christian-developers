import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { companySchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  requireCompanyOwner,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';

async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('companies')
      .select(
        `*,
        active_jobs:job_listings(*, applications_count:job_applications(count))`
      )
      .eq('id', companyId)
      .single();

    if (error || !data) {
      return createErrorResponse('Company not found', 404);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('GET /api/companies/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: updateData, error: validationError } = await validateRequest(
      request,
      companySchema.partial()
    );
    if (validationError) return validationError;

    // Verify ownership
    const isOwner = await requireCompanyOwner(user!.id, companyId);
    if (!isOwner) {
      return createErrorResponse('You do not own this company', 403);
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Company profile updated');
  } catch (error) {
    console.error('PATCH /api/companies/[id] error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const GET = asyncHandler(GET);
export const PATCH = asyncHandler(PATCH);
