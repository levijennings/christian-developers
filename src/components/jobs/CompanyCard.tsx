import React from 'react';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export interface CompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  size: string;
  industry: string;
  missionExcerpt: string;
  activeJobCount: number;
  onViewJobs?: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  id,
  name,
  logo,
  size,
  industry,
  missionExcerpt,
  activeJobCount,
  onViewJobs,
}) => {
  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        {logo && (
          <img
            src={logo}
            alt={`${name} logo`}
            className="h-16 w-16 rounded object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{size}</p>
        </div>
      </div>

      <div className="space-y-3 flex-1 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Industry
          </p>
          <p className="text-sm text-gray-900 mt-1">{industry}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Mission
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {missionExcerpt}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Open Positions
          </p>
          <p className="text-sm text-gray-900 mt-1 font-medium">
            {activeJobCount} {activeJobCount === 1 ? 'job' : 'jobs'}
          </p>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onViewJobs}
        className="w-full justify-center"
        icon={<ArrowRight className="h-4 w-4" />}
      >
        View Jobs
      </Button>
    </Card>
  );
};

export default CompanyCard;
