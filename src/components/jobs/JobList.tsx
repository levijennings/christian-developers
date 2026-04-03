import React from 'react';
import JobCard, { JobCardProps } from './JobCard';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import { Briefcase } from 'lucide-react';

export interface JobListProps {
  jobs: JobCardProps[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onJobApply?: (jobId: string) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading = false,
  isEmpty = false,
  onJobApply,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex gap-4">
              <Skeleton variant="circle" width="48px" height="48px" />
              <div className="flex-1 space-y-3">
                <Skeleton variant="text" height="16px" width="30%" />
                <Skeleton variant="text" height="24px" width="60%" />
                <div className="flex gap-2">
                  <Skeleton variant="rect" width="80px" height="24px" />
                  <Skeleton variant="rect" width="100px" height="24px" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty || jobs.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No jobs found"
        description="Try adjusting your filters to find more opportunities."
      />
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          {...job}
          onApply={() => onJobApply?.(job.id)}
        />
      ))}
    </div>
  );
};

export default JobList;
