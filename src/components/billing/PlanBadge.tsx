/**
 * Christian Developers Plan Badge Component
 */

import { PlanTier } from "@/lib/stripe/types";
import { formatPlanTier } from "@/lib/stripe/helpers";

interface PlanBadgeProps {
  tier: PlanTier;
  size?: "sm" | "md" | "lg";
}

const tierColors: Record<PlanTier, { bg: string; text: string; border: string }> = {
  community: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" },
  pro: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  employer: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  starter: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  professional: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  enterprise: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
};

const sizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export function PlanBadge({ tier, size = "md" }: PlanBadgeProps) {
  const colors = tierColors[tier];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizes[size]}`}
    >
      {formatPlanTier(tier)}
    </span>
  );
}
