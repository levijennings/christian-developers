import React, { useState } from 'react';
import { ThumbsUp, Reply, Trash2 } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export interface ForumReplyProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  authorIsOp?: boolean;
  body: string;
  upvoteCount: number;
  postedAt: Date;
  depth?: number;
  onReply?: () => void;
  onDelete?: () => void;
  onUpvote?: () => void;
  userUpvoted?: boolean;
  isAuthor?: boolean;
  children?: React.ReactNode;
}

const ForumReply: React.FC<ForumReplyProps> = ({
  id,
  authorName,
  authorAvatar,
  authorInitials,
  authorIsOp = false,
  body,
  upvoteCount,
  postedAt,
  depth = 0,
  onReply,
  onDelete,
  onUpvote,
  userUpvoted = false,
  isAuthor = false,
  children,
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

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : '';

  return (
    <div className={indentClass}>
      <div className="border-l-2 border-gray-200 pl-4 py-4">
        <div className="flex gap-3">
          <Avatar
            src={authorAvatar}
            initials={authorInitials}
            size="sm"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-gray-900">
                {authorName}
              </p>
              {authorIsOp && (
                <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded font-medium">
                  OP
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatTime(postedAt)}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 mb-3">
              <p>{body}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  upvoted
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${upvoted ? 'fill-current' : ''}`} />
                {upvotes}
              </button>

              <button
                onClick={onReply}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Reply className="h-4 w-4" />
                Reply
              </button>

              {isAuthor && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default ForumReply;
