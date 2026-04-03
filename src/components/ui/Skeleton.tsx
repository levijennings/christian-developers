import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = '',
  ...props
}) => {
  const baseClasses =
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded';

  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  const defaultHeights = {
    text: '1rem',
    circle: '2.5rem',
    rect: '6rem',
  };

  const finalHeight = height || defaultHeights[variant];
  const finalWidth = variant === 'circle' ? finalHeight : width;

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            variant={variant}
            width={width}
            height={height}
            className={className}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width: finalWidth,
        height: finalHeight,
      }}
      {...props}
    />
  );
};

export default Skeleton;
