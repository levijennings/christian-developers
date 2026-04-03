import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  featured?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, featured = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'rounded-lg bg-white shadow-sm border border-gray-200';
    const hoverClasses = hover
      ? 'transition-shadow duration-200 hover:shadow-md'
      : '';
    const featuredClasses = featured ? 'border-l-4 border-l-indigo-500' : '';

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${hoverClasses} ${featuredClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
