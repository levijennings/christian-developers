/**
 * Christian Developers Upgrade Prompt Component
 * Inline prompt when approaching application limits
 */

interface UpgradePromptProps {
  remaining: number;
  onUpgradeClick: () => void;
}

export function UpgradePrompt({ remaining, onUpgradeClick }: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <svg
              className="h-6 w-6 text-green-600 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-bold text-gray-900">
              Only {remaining} {remaining === 1 ? "application" : "applications"} left
            </h3>
          </div>

          <p className="text-gray-700 mb-4">
            You're running low on your Community plan limit. Ready to apply to
            unlimited jobs?
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">Unlimited applications</span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">Featured profile</span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">Mentor matching</span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">Prayer groups</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Pro is just <span className="font-bold text-green-600">$9/month</span> or{" "}
            <span className="font-bold text-green-600">$89/year</span>.
          </p>
        </div>

        <button
          onClick={onUpgradeClick}
          className="flex-shrink-0 ml-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
