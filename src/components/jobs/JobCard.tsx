import React from 'react';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export interface JobCardProps {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  jobType: 'full-time' | 'contract' | 'freelance';
  salaryMin?: number;
  salaryMax?: number;
  techStack: string[];
  postedAt: Date;
  featured?: boolean;
  onApply?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  companyName,
  companyLogo,
  jobTitle,
  locationType,
  jobType,
  salaryMin,
  salaryMax,
  techStack,
  postedAt,
  featured = false,
  onApply,
}) => {
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

  const formatSalary = () => {
    if (!salaryMin || !salaryMax) return null;
    return `$${(salaryMin / 1000).toFixed(0)}k - $${(salaryMax / 1000).toFixed(0)}k`;
  };

  return (
    <Card featured={featured} className="p-6">
      <div className="flex gap-4">
        {companyLogo && (
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className="h-12 w-12 rounded object-cover flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-sm text-gray-600 font-medium">{companyName}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-0.5 line-clamp-1">
                {jobTitle}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              variant="location-type"
              locationType={locationType}
              size="sm"
            >
              {locationType.charAt(0).toUpperCase() + locationType.slice(1)}
            </Badge>
            <Badge variant="job-type" jobType={jobType} size="sm">
              {jobType === 'full-time'
                ? 'Full-time'
                : jobType === 'contract'
                  ? 'Contract'
                  : 'Freelance'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
            {formatSalary() && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatSalary()}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(postedAt)}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {techStack.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="tech-stack" size="sm">
                {tech}
              </Badge>
            ))}
            {techStack.length > 5 && (
              <Badge variant="tech-stack" size="sm">
                +{techStack.length - 5}
              </Badge>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onApply}
              variant="primary"
              size="sm"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
