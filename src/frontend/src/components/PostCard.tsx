import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Post, User } from "../types";
import { getInitials, getRelativeTime } from "../utils/helpers";

const CATEGORY_COLORS: Record<string, string> = {
  "Art & Creativity": "bg-purple-100 text-purple-700 border-purple-200",
  "Study Buddies": "bg-green-100 text-green-700 border-green-200",
  "Tech Chat": "bg-blue-100 text-blue-700 border-blue-200",
  Hobbies: "bg-orange-100 text-orange-700 border-orange-200",
  General: "bg-gray-100 text-gray-700 border-gray-200",
};

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
  index: number;
}

export function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onDelete,
  index,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const avatarLetter = getInitials(post.authorName);
  const categoryColor =
    CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.General;
  const isOwn = currentUser?.id === post.authorId;

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || !currentUser) return;
    onComment(post.id, trimmed);
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <article
      data-ocid={`post.item.${index}`}
      className="bg-card rounded-2xl shadow-card border border-border flex flex-col gap-0 overflow-hidden animate-fade-in"
    >
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: getAvatarColor(post.authorId) }}
          >
            {avatarLetter}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm leading-tight">
              {post.authorName}
            </p>
            <p className="text-muted-foreground text-xs">
              @{post.authorHandle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {getRelativeTime(post.createdAt)}
          </span>
          {isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  data-ocid="post.dropdown_menu"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => onDelete(post.id)}
                  data-ocid={`post.delete_button.${index}`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pb-3">
        <Badge
          variant="outline"
          className={`text-xs mb-2 rounded-full border ${categoryColor}`}
        >
          {post.category}
        </Badge>
        {post.title && (
          <h3 className="font-semibold text-foreground text-[15px] mb-1 leading-snug">
            {post.title}
          </h3>
        )}
        <p className="text-foreground/80 text-sm leading-relaxed line-clamp-4">
          {post.content}
        </p>
      </div>

      {/* Card footer */}
      <div className="px-5 py-3 border-t border-border flex items-center gap-4">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          data-ocid="post.toggle"
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            post.likedByMe
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart
            className="h-4 w-4"
            fill={post.likedByMe ? "currentColor" : "none"}
          />
          <span>{post.likes}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          data-ocid="post.button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-border px-5 py-4 flex flex-col gap-3 bg-muted/30">
          {post.comments.length === 0 ? (
            <p className="text-muted-foreground text-xs text-center py-2">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {post.comments.map((comment, ci) => (
                <div
                  key={comment.id}
                  className="flex gap-2 items-start"
                  data-ocid={`post.item.${ci + 1}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                    style={{
                      backgroundColor: getAvatarColor(comment.authorId),
                    }}
                  >
                    {getInitials(comment.authorName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs text-foreground">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      · {getRelativeTime(comment.createdAt)}
                    </span>
                    <p className="text-sm text-foreground/80 mt-0.5">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentUser && (
            <div className="flex gap-2 items-end">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment…"
                className="resize-none text-sm min-h-[60px] flex-1"
                data-ocid="post.textarea"
              />
              <Button
                size="icon"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="h-9 w-9 rounded-xl flex-shrink-0"
                data-ocid="post.submit_button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

const AVATAR_PALETTE = [
  "#6FA3C8",
  "#8EC9A4",
  "#E8956D",
  "#C47BC8",
  "#7BBFE8",
  "#E8C46D",
  "#E87B9A",
  "#7BC8B4",
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export { getAvatarColor };
