/**
 * Christian Developers Billing API - Application Limits
 * GET /api/billing/limits?customerId=xxx
 * POST /api/billing/limits
 *
 * Manages application limits and monthly resets
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const limitsQuerySchema = z.object({
  customerId: z.string().min(1, "Customer ID required"),
});

const limitsUpdateSchema = z.object({
  customerId: z.string().min(1, "Customer ID required"),
  incrementBy: z.number().int().nonnegative().default(1),
});

/**
 * GET /api/billing/limits
 * Get current application usage and limits
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { customerId } = limitsQuerySchema.parse({
      customerId: searchParams.get("customerId"),
    });

    // TODO: Fetch from database
    // const record = await db.applicationLimits.findUnique({
    //   where: { customerId },
    //   include: { subscription: true }
    // });

    // Mock response
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const currentTier = "pro"; // Would come from subscription
    const limits: Record<string, number> = {
      community: 5,
      pro: Infinity,
      employer: Infinity,
    };

    const used = 3;
    const limit = limits[currentTier] || 5;
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);
    const resetDate = new Date(monthEnd);
    resetDate.setHours(23, 59, 59, 999);

    return NextResponse.json({
      customerId,
      currentTier,
      applications: {
        used,
        limit,
        remaining,
        percentage: limit === Infinity ? 0 : Math.round((used / limit) * 100),
      },
      monthStart,
      monthEnd,
      resetDate,
      warnings: remaining !== Infinity && remaining <= 2
        ? ["You have limited applications remaining this month"]
        : [],
    });
  } catch (error) {
    console.error("Limits query error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch limits" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/billing/limits
 * Increment application usage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, incrementBy } = limitsUpdateSchema.parse(body);

    // TODO: Update usage in database
    // await db.applicationLimits.update({
    //   where: { customerId },
    //   data: {
    //     applicationsUsed: {
    //       increment: incrementBy
    //     },
    //     updatedAt: new Date()
    //   }
    // });

    // Check if over limit and reject if needed
    // const updated = await db.applicationLimits.findUnique({
    //   where: { customerId },
    //   include: { subscription: true }
    // });

    const currentTier = "pro"; // Would come from subscription
    const limits: Record<string, number> = {
      community: 5,
      pro: Infinity,
      employer: Infinity,
    };

    const currentUsed = 4;
    const limit = limits[currentTier];

    if (limit !== Infinity && currentUsed > limit) {
      return NextResponse.json(
        {
          error: "Application limit exceeded",
          message: `You have reached your limit of ${limit} applications this month. Upgrade to Pro to apply to unlimited jobs.`,
          requiresUpgrade: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        customerId,
        incremented: incrementBy,
        newUsage: currentUsed,
        limit,
        remaining: limit === Infinity ? Infinity : limit - currentUsed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Limits update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update limits" },
      { status: 500 }
    );
  }
}
