import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data?: T; error?: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten();
      return {
        error: createErrorResponse('Validation failed', 400, errors),
      };
    }

    return { data: result.data };
  } catch (error) {
    return {
      error: createErrorResponse('Invalid JSON in request body', 400),
    };
  }
}

/**
 * Require authentication - returns user if authenticated
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user?: { id: string; email?: string }; error?: NextResponse }> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: createErrorResponse('Unauthorized', 401),
      };
    }

    return { user: { id: user.id, email: user.email } };
  } catch (error) {
    return {
      error: createErrorResponse('Authentication failed', 401),
    };
  }
}

/**
 * Get user profile for authorization checks
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user owns a company
 */
export async function requireCompanyOwner(
  userId: string,
  companyId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('id', companyId)
      .eq('owner_id', userId)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Check if user is job owner
 */
export async function requireJobOwner(
  userId: string,
  jobId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('job_listings')
      .select('id, company_id')
      .eq('id', jobId)
      .single();

    if (error || !data) return false;

    return await requireCompanyOwner(userId, data.company_id);
  } catch (error) {
    return false;
  }
}

/**
 * Check if user is post author
 */
export async function requirePostAuthor(
  userId: string,
  postId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', postId)
      .eq('author_id', userId)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Check if user is reply author
 */
export async function requireReplyAuthor(
  userId: string,
  replyId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('forum_replies')
      .select('id')
      .eq('id', replyId)
      .eq('author_id', userId)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Parse pagination parameters
 */
export function parsePagination(page?: string, limit?: string) {
  const p = Math.max(1, parseInt(page || '1', 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit || '20', 10) || 20));
  const offset = (p - 1) * l;

  return { page: p, limit: l, offset };
}

/**
 * Get user subscription status
 */
export async function getUserSubscriptionStatus(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      status: data?.subscription_status || 'none',
      plan: data?.subscription_plan || 'free',
    };
  } catch (error) {
    return { status: 'none', plan: 'free' };
  }
}

/**
 * Check if user is a mentorship pair participant
 */
export async function isMentorshipParticipant(
  userId: string,
  pairId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('mentorship_pairs')
      .select('id')
      .eq('id', pairId)
      .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Format database errors for API response
 */
export function formatDatabaseError(error: any): string {
  if (error?.code === 'PGRST116') {
    return 'Resource not found';
  }
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  if (error?.code === '23503') {
    return 'Referenced record does not exist';
  }
  return error?.message || 'Database error';
}

/**
 * Wrap async route handlers with error handling
 */
export function asyncHandler(
  fn: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await fn(req);
    } catch (error) {
      console.error('Route error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  };
}
