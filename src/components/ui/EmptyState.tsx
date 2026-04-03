import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'centered' | 'compact';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'centered',
}) => {
  const containerClasses =
    variant === 'centered'
      ? 'flex flex-col items-center justify-center min-h-[300px] py-12'
      : 'py-8 text-center';

  return (
    <div className={containerClasses}>
      {Icon && (
        <Icon className="h-16 w-16 text-gray-400 mb-4" aria-hidden="true" />
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
