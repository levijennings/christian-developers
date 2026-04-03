import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'tech-stack'
    | 'job-type'
    | 'experience-level'
    | 'location-type';
  color?: 'indigo' | 'green' | 'amber' | 'purple' | 'blue' | 'gray';
  jobType?: 'full-time' | 'contract' | 'freelance';
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead';
  locationType?: 'remote' | 'onsite' | 'hybrid';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      color = 'indigo',
      jobType,
      experienceLevel,
      locationType,
      size = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-block font-medium font-[Instrument_Sans] rounded-full whitespace-nowrap';

    const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

    let variantClasses = '';

    if (variant === 'default') {
      const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-100 text-indigo-800',
        green: 'bg-green-100 text-green-800',
        amber: 'bg-amber-100 text-amber-800',
        purple: 'bg-purple-100 text-purple-800',
        blue: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800',
      };
      variantClasses = colorMap[color] || colorMap.indigo;
    } else if (variant === 'tech-stack') {
      variantClasses =
        'bg-gray-100 text-gray-700 border border-gray-300 text-xs px-2.5 py-1';
    } else if (variant === 'job-type') {
      if (jobType === 'full-time') {
        variantClasses = 'bg-green-100 text-green-800';
      } else if (jobType === 'contract') {
        variantClasses = 'bg-amber-100 text-amber-800';
      } else if (jobType === 'freelance') {
        variantClasses = 'bg-purple-100 text-purple-800';
      }
    } else if (variant === 'experience-level') {
      const expMap: Record<string, string> = {
        junior: 'bg-blue-100 text-blue-800',
        mid: 'bg-indigo-100 text-indigo-800',
        senior: 'bg-purple-100 text-purple-800',
        lead: 'bg-rose-100 text-rose-800',
      };
      variantClasses = expMap[experienceLevel || 'junior'] || expMap.junior;
    } else if (variant === 'location-type') {
      const locMap: Record<string, string> = {
        remote: 'bg-green-100 text-green-800',
        onsite: 'bg-blue-100 text-blue-800',
        hybrid: 'bg-indigo-100 text-indigo-800',
      };
      variantClasses = locMap[locationType || 'remote'] || locMap.remote;
    }

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
