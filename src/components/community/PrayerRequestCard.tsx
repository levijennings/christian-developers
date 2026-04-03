import React, { useState } from 'react';
import { Hands, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export interface PrayerRequestCardProps {
  id: string;
  title: string;
  body: string;
  prayerCount: number;
  status: 'active' | 'answered';
  isAnonymous?: boolean;
  createdAt: Date;
  onPray?: () => void;
  userPrayed?: boolean;
}

const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({
  id,
  title,
  body,
  prayerCount,
  status,
  isAnonymous = false,
  createdAt,
  onPray,
  userPrayed = false,
}) => {
  const [prayed, setPrayed] = useState(userPrayed);
  const [prayerTotal, setPrayerTotal] = useState(prayerCount);

  const handlePray = () => {
    if (!prayed) {
      setPrayed(true);
      setPrayerTotal(prayerTotal + 1);
      onPray?.();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}m ago`;
  };

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {title}
            </h3>
            {isAnonymous && (
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                Anonymous
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{body}</p>
        </div>

        <Badge
          variant="default"
          color={status === 'answered' ? 'green' : 'indigo'}
          size="sm"
          className="flex-shrink-0 ml-2"
        >
          {status === 'answered' ? 'Answered' : 'Active'}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePray}
            disabled={prayed}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              prayed
                ? 'text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            } ${prayed ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <Hands className={`h-4 w-4 ${prayed ? 'fill-current' : ''}`} />
            {prayerTotal} {prayerTotal === 1 ? 'prayer' : 'prayers'}
          </button>

          <span className="text-xs text-gray-500">{formatTime(createdAt)}</span>
        </div>

        {status === 'answered' && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PrayerRequestCard;
