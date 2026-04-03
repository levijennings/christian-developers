import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { applicationSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  formatDatabaseError,
  asyncHandler,
  getUserSubscriptionStatus,
} from '@/lib/api-helpers';

async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: appData, error: validationError } = await validateRequest(
      request,
      applicationSchema
    );
    if (validationError) return validationError;

    // Verify job exists
    const supabase = createClient();
    const { data: job, error: jobError } = await supabase
      .from('job_listings')
      .select('id, is_active')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return createErrorResponse('Job listing not found', 404);
    }

    if (!job.is_active) {
      return createErrorResponse('This job listing is no longer active', 410);
    }

    // Check subscription for rate limiting (free tier: 5 applications per month)
    const subscription = await getUserSubscriptionStatus(user!.id);
    if (subscription.plan === 'free') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentApps, error: countError } = await supabase
        .from('job_applications')
        .select('id', { count: 'exact' })
        .eq('applicant_id', user!.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!countError && recentApps && recentApps.length >= 5) {
        return createErrorResponse(
          'Free users can apply to max 5 jobs per month. Upgrade to pro for unlimited applications.',
          429
        );
      }
    }

    // Check for duplicate application
    const { data: existing } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', user!.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return createErrorResponse('You have already applied to this job', 409);
    }

    // Create application
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          job_id: jobId,
          applicant_id: user!.id,
          cover_letter: appData.cover_letter,
          resume_url: appData.resume_url,
          status: 'pending',
        },
      ])
      .select(
        `*,
        job:job_listings(id, title, company_id),
        applicant:profiles(id, display_name, email)`
      )
      .single();

    if (error) throw error;

    return createSuccessResponse(data, 'Application submitted', 201);
  } catch (error) {
    console.error('POST /api/jobs/[id]/apply error:', error);
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const POST = asyncHandler(POST);
