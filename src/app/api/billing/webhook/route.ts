/**
 * Christian Developers Billing API - Webhook Handler
 * POST /api/billing/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  handleCheckoutSessionCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
} from "@/lib/stripe/webhooks";

const webhookCallbacks = {
  onSubscriptionCreated: async (customerId: string, subscription: any) => {
    console.log(`Subscription created for customer ${customerId}:`, subscription);
  },

  onApplicationLimitsReset: async (customerId: string) => {
    console.log(`Application limits reset for customer ${customerId}`);
  },

  onSubscriptionUpdated: async (subscription: any) => {
    console.log(`Subscription updated:`, subscription);
  },

  onPlanChanged: async (customerId: string, oldTier: string, newTier: string) => {
    console.log(
      `Plan changed for customer ${customerId}: ${oldTier} -> ${newTier}`
    );
  },

  onApplicationLimitsUpdated: async (customerId: string, newTier: string) => {
    console.log(`Application limits updated for customer ${customerId}: ${newTier}`);
  },

  onSubscriptionCanceled: async (customerId: string, subscriptionId: string) => {
    console.log(`Subscription canceled: ${subscriptionId} for customer ${customerId}`);
  },

  onPaymentSucceeded: async (invoice: any) => {
    console.log(`Payment succeeded for invoice ${invoice.id}`);
  },

  onPaymentFailed: async (invoice: any, retryAfter?: Date) => {
    console.log(`Payment failed for invoice ${invoice.id}, retry after ${retryAfter}`);
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const event = await verifyWebhookSignature(body, signature, secret);
    if (!event) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event, {
          onSubscriptionCreated: webhookCallbacks.onSubscriptionCreated,
          onApplicationLimitsReset: webhookCallbacks.onApplicationLimitsReset,
        });
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event, {
          onSubscriptionUpdated: webhookCallbacks.onSubscriptionUpdated,
          onPlanChanged: webhookCallbacks.onPlanChanged,
          onApplicationLimitsUpdated: webhookCallbacks.onApplicationLimitsUpdated,
        });
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event, {
          onSubscriptionCanceled: webhookCallbacks.onSubscriptionCanceled,
          onApplicationLimitsReset: webhookCallbacks.onApplicationLimitsReset,
        });
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event, {
          onPaymentSucceeded: webhookCallbacks.onPaymentSucceeded,
        });
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event, {
          onPaymentFailed: webhookCallbacks.onPaymentFailed,
        });
        break;

      default:
        console.warn(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
