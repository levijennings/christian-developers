/**
 * Christian Developers Billing Dashboard Component
 * Shows plan info, application usage, upgrade CTA
 */

"use client";

import { useEffect, useState } from "react";
import { PlanBadge } from "./PlanBadge";
import { ApplicationCounter } from "./ApplicationCounter";
import { UpgradePrompt } from "./UpgradePrompt";
import { getLimit } from "@/lib/stripe/config";

interface BillingDashboardProps {
  customerId: string;
  userType: "job_seeker" | "employer";
}

interface LimitsData {
  customerId: string;
  currentTier: string;
  applications: {
    used: number;
    limit: number | null;
    remaining: number;
    percentage: number;
  };
  monthStart: string;
  monthEnd: string;
  resetDate: string;
  warnings: string[];
}

export function BillingDashboard({ customerId, userType }: BillingDashboardProps) {
  const [limits, setLimits] = useState<LimitsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLimits() {
      try {
        const res = await fetch(`/api/billing/limits?customerId=${customerId}`);
        if (!res.ok) throw new Error("Failed to fetch limits");
        const data = await res.json();
        setLimits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    if (userType === "job_seeker") {
      fetchLimits();
    } else {
      setLoading(false);
    }
  }, [customerId, userType]);

  if (userType === "employer") {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Employer Plan</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Manage Plan
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Current Plan</p>
              <PlanBadge tier="employer" />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Billing Cycle</p>
              <p className="text-lg font-semibold text-gray-900">Monthly</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Employer Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Unlimited Job Posts</p>
                <p className="text-sm text-gray-600">Post as many jobs as you need</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Applicant Tracking System</p>
                <p className="text-sm text-gray-600">Manage all your candidates in one place</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Featured Listings</p>
                <p className="text-sm text-gray-600">Get priority placement in search results</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Company Page</p>
                <p className="text-sm text-gray-600">Showcase your company values</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  if (!limits) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Plan</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Change Plan
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Current Plan</p>
            <PlanBadge tier={limits.currentTier as any} />
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Billing Period</p>
            <p className="text-lg font-semibold text-gray-900">Monthly</p>
          </div>
        </div>
      </div>

      {/* Application Usage */}
      {limits.currentTier === "community" && (
        <>
          <ApplicationCounter
            used={limits.applications.used}
            limit={limits.applications.limit}
            percentage={limits.applications.percentage}
            resetDate={new Date(limits.resetDate)}
          />

          {/* Show upgrade prompt if approaching limit */}
          {limits.applications.remaining !== Infinity &&
            limits.applications.remaining <= 2 && (
              <UpgradePrompt
                remaining={limits.applications.remaining}
                onUpgradeClick={() => {
                  // Handle upgrade
                }}
              />
            )}
        </>
      )}

      {limits.currentTier === "pro" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-2">
            Unlimited Applications
          </h3>
          <p className="text-green-700">
            You can apply to unlimited job postings. Make the most of your Pro
            membership!
          </p>
        </div>
      )}

      {/* Plan Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Plan Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Monthly Cost:</span>
            <span className="font-semibold text-gray-900">
              {limits.currentTier === "community"
                ? "Free"
                : limits.currentTier === "pro"
                  ? "$9.00"
                  : "Contact Sales"}
            </span>
          </div>
          <div className="flex justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Billing Cycle:</span>
            <span className="font-semibold text-gray-900">
              {new Date(limits.monthStart).toLocaleDateString()} -{" "}
              {new Date(limits.monthEnd).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Next Reset:</span>
            <span className="font-semibold text-gray-900">
              {new Date(limits.resetDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-700 mb-4">
          Have questions about your plan or need to upgrade?
        </p>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
