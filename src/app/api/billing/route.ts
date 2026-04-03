import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkoutSchema } from '@/lib/validations';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
  requireAuth,
  formatDatabaseError,
  asyncHandler,
} from '@/lib/api-helpers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Plan pricing (in cents)
const PLANS = {
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    amount: 9900, // $99/month
  },
  employer: {
    name: 'Employer',
    priceId: process.env.STRIPE_EMPLOYER_PRICE_ID || '',
    amount: 29900, // $299/month
  },
};

async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth(request);
    if (authError) return authError;

    const { data: checkoutData, error: validationError } = await validateRequest(
      request,
      checkoutSchema
    );
    if (validationError) return validationError;

    const plan = PLANS[checkoutData.plan_type as keyof typeof PLANS];
    if (!plan || !plan.priceId) {
      return createErrorResponse('Invalid plan type', 400);
    }

    const supabase = createClient();

    // Get or create Stripe customer
    let customerId: string;
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user!.id)
      .single();

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user!.email,
        metadata: {
          userId: user!.id,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user!.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${checkoutData.return_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: checkoutData.return_url,
      metadata: {
        userId: user!.id,
        planType: checkoutData.plan_type,
      },
    });

    return createSuccessResponse(
      {
        sessionId: session.id,
        url: session.url,
      },
      'Checkout session created',
      201
    );
  } catch (error) {
    console.error('POST /api/billing error:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return createErrorResponse(error.message, 500);
    }
    return createErrorResponse(formatDatabaseError(error), 500);
  }
}

export const POST = asyncHandler(POST);
