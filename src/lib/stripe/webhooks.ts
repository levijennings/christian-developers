/**
 * Christian Developers Stripe Webhooks
 * Handles all Stripe events and updates database
 */

import { StripeWebhookEvent, Subscription, Invoice } from "@/lib/stripe/types";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

/**
 * Verify webhook signature
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<StripeWebhookEvent | null> {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    return event as unknown as StripeWebhookEvent;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutSessionCompleted(
  event: StripeWebhookEvent,
  callbacks: {
    onSubscriptionCreated?: (customerId: string, subscription: Subscription) => Promise<void>;
    onApplicationLimitsReset?: (customerId: string) => Promise<void>;
  }
): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.customer || !session.subscription) {
    console.warn("Checkout session missing customer or subscription", session.id);
    return;
  }

  const customerId = typeof session.customer === "string"
    ? session.customer
    : session.customer.id;

  const subscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription.id;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const mappedSubscription: Subscription = {
      id: subscription.id,
      customerId,
      priceId: subscription.items.data[0]?.price.id || "",
      productId: subscription.items.data[0]?.price.product as string || "",
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      metadata: subscription.metadata || undefined,
    };

    if (callbacks.onSubscriptionCreated) {
      await callbacks.onSubscriptionCreated(customerId, mappedSubscription);
    }

    // Reset application limits for new Pro/Employer subscriptions
    if (callbacks.onApplicationLimitsReset) {
      await callbacks.onApplicationLimitsReset(customerId);
    }
  } catch (error) {
    console.error("Error processing checkout.session.completed:", error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(
  event: StripeWebhookEvent,
  callbacks: {
    onSubscriptionUpdated?: (subscription: Subscription) => Promise<void>;
    onPlanChanged?: (customerId: string, oldTier: string, newTier: string) => Promise<void>;
    onApplicationLimitsUpdated?: (customerId: string, newTier: string) => Promise<void>;
  }
): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;

  try {
    const mappedSubscription: Subscription = {
      id: subscription.id,
      customerId: subscription.customer as string,
      priceId: subscription.items.data[0]?.price.id || "",
      productId: subscription.items.data[0]?.price.product as string || "",
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      metadata: subscription.metadata || undefined,
    };

    if (callbacks.onSubscriptionUpdated) {
      await callbacks.onSubscriptionUpdated(mappedSubscription);
    }

    // Detect plan/tier change
    if (callbacks.onPlanChanged || callbacks.onApplicationLimitsUpdated) {
      const newTier = subscription.metadata?.tier;
      const oldTier = event.data.previous_attributes?.metadata?.tier;

      if (oldTier && newTier && oldTier !== newTier && callbacks.onPlanChanged) {
        await callbacks.onPlanChanged(
          subscription.customer as string,
          oldTier,
          newTier
        );
      }

      if (newTier && callbacks.onApplicationLimitsUpdated) {
        await callbacks.onApplicationLimitsUpdated(
          subscription.customer as string,
          newTier
        );
      }
    }
  } catch (error) {
    console.error("Error processing customer.subscription.updated:", error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(
  event: StripeWebhookEvent,
  callbacks: {
    onSubscriptionCanceled?: (customerId: string, subscriptionId: string) => Promise<void>;
    onApplicationLimitsReset?: (customerId: string) => Promise<void>;
  }
): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;

  try {
    if (callbacks.onSubscriptionCanceled) {
      await callbacks.onSubscriptionCanceled(
        subscription.customer as string,
        subscription.id
      );
    }

    // Reset to Community tier limits
    if (callbacks.onApplicationLimitsReset) {
      await callbacks.onApplicationLimitsReset(subscription.customer as string);
    }
  } catch (error) {
    console.error("Error processing customer.subscription.deleted:", error);
    throw error;
  }
}

/**
 * Handle invoice.payment_succeeded event
 */
export async function handleInvoicePaymentSucceeded(
  event: StripeWebhookEvent,
  callbacks: {
    onPaymentSucceeded?: (invoice: Invoice) => Promise<void>;
  }
): Promise<void> {
  const stripeInvoice = event.data.object as Stripe.Invoice;

  try {
    const invoice: Invoice = {
      id: stripeInvoice.id,
      number: stripeInvoice.number || "",
      customerId: stripeInvoice.customer as string,
      subscriptionId: typeof stripeInvoice.subscription === "string"
        ? stripeInvoice.subscription
        : (stripeInvoice.subscription?.id || ""),
      amount: stripeInvoice.amount_paid,
      currency: stripeInvoice.currency,
      status: stripeInvoice.status as any,
      description: stripeInvoice.description || undefined,
      pdfUrl: stripeInvoice.invoice_pdf || "",
      createdAt: new Date(stripeInvoice.created * 1000),
      dueDate: stripeInvoice.due_date ? new Date(stripeInvoice.due_date * 1000) : null,
      paidAt: stripeInvoice.paid_at ? new Date(stripeInvoice.paid_at * 1000) : null,
      attemptCount: stripeInvoice.attempt_count || 0,
      nextAttemptDate: stripeInvoice.next_payment_attempt
        ? new Date(stripeInvoice.next_payment_attempt * 1000)
        : null,
      metadata: stripeInvoice.metadata || undefined,
    };

    if (callbacks.onPaymentSucceeded) {
      await callbacks.onPaymentSucceeded(invoice);
    }
  } catch (error) {
    console.error("Error processing invoice.payment_succeeded:", error);
    throw error;
  }
}

/**
 * Handle invoice.payment_failed event
 */
export async function handleInvoicePaymentFailed(
  event: StripeWebhookEvent,
  callbacks: {
    onPaymentFailed?: (invoice: Invoice, retryAfter?: Date) => Promise<void>;
  }
): Promise<void> {
  const stripeInvoice = event.data.object as Stripe.Invoice;

  try {
    const invoice: Invoice = {
      id: stripeInvoice.id,
      number: stripeInvoice.number || "",
      customerId: stripeInvoice.customer as string,
      subscriptionId: typeof stripeInvoice.subscription === "string"
        ? stripeInvoice.subscription
        : (stripeInvoice.subscription?.id || ""),
      amount: stripeInvoice.amount_due,
      currency: stripeInvoice.currency,
      status: stripeInvoice.status as any,
      description: stripeInvoice.description || undefined,
      pdfUrl: stripeInvoice.invoice_pdf || "",
      createdAt: new Date(stripeInvoice.created * 1000),
      dueDate: stripeInvoice.due_date ? new Date(stripeInvoice.due_date * 1000) : null,
      paidAt: null,
      attemptCount: stripeInvoice.attempt_count || 0,
      nextAttemptDate: stripeInvoice.next_payment_attempt
        ? new Date(stripeInvoice.next_payment_attempt * 1000)
        : null,
      metadata: stripeInvoice.metadata || undefined,
    };

    if (callbacks.onPaymentFailed) {
      await callbacks.onPaymentFailed(
        invoice,
        stripeInvoice.next_payment_attempt
          ? new Date(stripeInvoice.next_payment_attempt * 1000)
          : undefined
      );
    }
  } catch (error) {
    console.error("Error processing invoice.payment_failed:", error);
    throw error;
  }
}
