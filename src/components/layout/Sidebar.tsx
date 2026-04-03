import React from 'react';
import { MessageCircle, Flame, Hands } from 'lucide-react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

export interface SidebarCategory {
  id: string;
  name: string;
  postCount?: number;
  color?: string;
}

export interface TrendingTag {
  id: string;
  name: string;
  count: number;
}

export interface FeaturedPrayerRequest {
  id: string;
  title: string;
  prayerCount: number;
}

export interface SidebarProps {
  categories?: SidebarCategory[];
  trendingTags?: TrendingTag[];
  featuredPrayerRequests?: FeaturedPrayerRequest[];
  onCategoryClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onPrayerRequestClick?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories = [
    { id: '1', name: 'Career Advice', postCount: 234, color: 'blue' },
    { id: '2', name: 'Technical Help', postCount: 567, color: 'purple' },
    { id: '3', name: 'Faith & Work', postCount: 189, color: 'rose' },
    { id: '4', name: 'Mentorship', postCount: 145, color: 'green' },
    { id: '5', name: 'Opportunities', postCount: 78, color: 'amber' },
  ],
  trendingTags = [
    { id: '1', name: 'React', count: 234 },
    { id: '2', name: 'Remote', count: 189 },
    { id: '3', name: 'Startup', count: 156 },
    { id: '4', name: 'Leadership', count: 145 },
    { id: '5', name: 'TypeScript', count: 134 },
  ],
  featuredPrayerRequests = [
    { id: '1', title: 'Guidance on job decision', prayerCount: 45 },
    { id: '2', title: 'Wisdom for current project', prayerCount: 32 },
    { id: '3', title: 'Strength during transition', prayerCount: 28 },
  ],
  onCategoryClick,
  onTagClick,
  onPrayerRequestClick,
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    rose: 'bg-rose-100 text-rose-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <aside className="space-y-6">
      {/* Forum Categories */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Forum Categories</h3>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category.id)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-between group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
              {category.postCount && (
                <span className="text-xs text-gray-500 group-hover:text-gray-700">
                  {category.postCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Trending Tags */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagClick?.(tag.name)}
              className="group"
              title={`${tag.count} discussions`}
            >
              <Badge
                variant="default"
                color="gray"
                size="sm"
                className="group-hover:bg-indigo-100 group-hover:text-indigo-800 cursor-pointer transition-colors"
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-75">
                  {tag.count}
                </span>
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Featured Prayer Requests */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Hands className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Prayer Requests</h3>
        </div>
        <div className="space-y-3">
          {featuredPrayerRequests.map((request) => (
            <button
              key={request.id}
              onClick={() => onPrayerRequestClick?.(request.id)}
              className="w-full text-left p-3 rounded bg-gray-50 hover:bg-indigo-50 transition-colors group"
            >
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 mb-2">
                {request.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-indigo-600">
                <Hands className="h-3 w-3" />
                {request.prayerCount} prayers
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <h3 className="font-semibold text-gray-900 mb-4">Community Highlights</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-600">Most Active Time</p>
            <p className="font-semibold text-gray-900">9 AM - 5 PM EST</p>
          </div>
          <div>
            <p className="text-gray-600">Member Milestone</p>
            <p className="font-semibold text-indigo-600">5,000+ Members</p>
          </div>
          <div>
            <p className="text-gray-600">Next Meetup</p>
            <p className="font-semibold text-gray-900">April 15, 2024</p>
          </div>
        </div>
      </Card>
    </aside>
  );
};

export default Sidebar;
