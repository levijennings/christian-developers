/**
 * Christian Developers Application Counter Component
 * Shows remaining applications this month
 */

interface ApplicationCounterProps {
  used: number;
  limit: number | null;
  percentage: number;
  resetDate: Date;
}

export function ApplicationCounter({
  used,
  limit,
  percentage,
  resetDate,
}: ApplicationCounterProps) {
  const remaining = limit !== null ? Math.max(0, limit - used) : 0;
  const daysUntilReset = Math.ceil(
    (resetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        This Month's Applications
      </h3>

      {/* Large counter */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center flex-1">
          <p className="text-5xl font-bold text-gray-900">{remaining}</p>
          <p className="text-gray-600 mt-2">of {limit} remaining</p>
        </div>

        <div className="w-24 h-24 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={percentage <= 50 ? "#10b981" : "#f59e0b"}
              strokeWidth="8"
              strokeDasharray={`${percentage * 2.83} 283`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Applications used:</span>
          <span className="font-semibold text-gray-900">{used}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Resets in:</span>
          <span className="font-semibold text-gray-900">
            {daysUntilReset} {daysUntilReset === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Reset date:</span>
          <span className="font-semibold text-gray-900">
            {resetDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Status message */}
      <div className="mt-4">
        {remaining === 0 ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">
              You've used all your applications for this month.
            </p>
          </div>
        ) : remaining <= 2 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium">
              You're running low on applications. Consider upgrading to Pro for
              unlimited access.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
