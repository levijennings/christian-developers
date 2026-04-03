import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

export interface ForumPostCardProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  title: string;
  bodyExcerpt: string;
  category: string;
  tags: string[];
  upvoteCount: number;
  replyCount: number;
  postedAt: Date;
  onPostClick?: () => void;
  onUpvote?: () => void;
  userUpvoted?: boolean;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({
  id,
  authorName,
  authorAvatar,
  authorInitials,
  title,
  bodyExcerpt,
  category,
  tags,
  upvoteCount,
  replyCount,
  postedAt,
  onPostClick,
  onUpvote,
  userUpvoted = false,
}) => {
  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvotes, setUpvotes] = useState(upvoteCount);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newUpvoted = !upvoted;
    setUpvoted(newUpvoted);
    setUpvotes(newUpvoted ? upvotes + 1 : upvotes - 1);
    onUpvote?.();
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
    <Card
      hover
      onClick={onPostClick}
      className="p-5 cursor-pointer"
    >
      <div className="flex gap-4">
        <Avatar
          src={authorAvatar}
          initials={authorInitials}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-gray-900">{authorName}</p>
            <span className="text-xs text-gray-500">
              {formatTime(postedAt)}
            </span>
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {bodyExcerpt}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="default" color="blue" size="sm">
              {category}
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                color="gray"
                size="sm"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                upvoted
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              title="Upvote this post"
            >
              <ThumbsUp className={`h-4 w-4 ${upvoted ? 'fill-current' : ''}`} />
              {upvotes}
            </button>

            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
              <MessageCircle className="h-4 w-4" />
              {replyCount}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(postedAt)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ForumPostCard;
