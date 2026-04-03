import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onlineStatus?: boolean;
  openToWork?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  initials,
  size = 'md',
  onlineStatus = false,
  openToWork = false,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const statusDotSizes = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const ringClasses = openToWork ? 'ring-2 ring-green-500' : '';

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover ${ringClasses}`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-indigo-500 text-white font-semibold flex items-center justify-center ${ringClasses}`}
        >
          {initials || '?'}
        </div>
      )}

      {onlineStatus && (
        <div
          className={`${statusDotSizes[size]} absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full`}
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;
