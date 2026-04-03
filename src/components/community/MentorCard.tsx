import React from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export interface MentorCardProps {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  title: string;
  experienceYears: number;
  skills: string[];
  focusAreas: string[];
  openToWork?: boolean;
  onRequestMentorship?: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
  id,
  name,
  avatar,
  initials,
  title,
  experienceYears,
  skills,
  focusAreas,
  openToWork = true,
  onRequestMentorship,
}) => {
  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <Avatar
          src={avatar}
          initials={initials}
          size="lg"
          openToWork={openToWork}
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{title}</p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {experienceYears} years experience
          </p>
        </div>
      </div>

      <div className="space-y-3 flex-1 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="tech-stack" size="sm">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="tech-stack" size="sm">
                +{skills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Focus Areas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {focusAreas.map((area) => (
              <Badge key={area} variant="default" color="blue" size="sm">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onRequestMentorship}
        className="w-full justify-center"
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Request Mentorship
      </Button>
    </Card>
  );
};

export default MentorCard;
