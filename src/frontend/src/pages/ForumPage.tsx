import { motion } from "motion/react";
import { useState } from "react";
import { PostCard } from "../components/PostCard";
import type { Post, PostCategory, User } from "../types";

const ALL_CATEGORIES: (PostCategory | "All")[] = [
  "All",
  "Art & Creativity",
  "Study Buddies",
  "Tech Chat",
  "Hobbies",
  "General",
];

interface ForumPageProps {
  posts: Post[];
  currentUser: User | null;
  initialCategory?: PostCategory;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
}

export function ForumPage({
  posts,
  currentUser,
  initialCategory,
  onLike,
  onComment,
  onDelete,
}: ForumPageProps) {
  const [activeCategory, setActiveCategory] = useState<PostCategory | "All">(
    initialCategory ?? "All",
  );

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const sorted = [...filtered].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-10" data-ocid="forum.page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-6">Forum</h1>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8" data-ocid="forum.section">
          {ALL_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-ocid="forum.tab"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-secondary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts grid */}
      {sorted.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="forum.empty_state"
        >
          <p className="text-5xl mb-4">🌿</p>
          <p className="text-lg font-medium">No posts here yet!</p>
          <p className="text-sm mt-1">Be the first to post in this category.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="forum.list"
        >
          {sorted.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={onLike}
              onComment={onComment}
              onDelete={onDelete}
              index={i + 1}
            />
          ))}
        </motion.div>
      )}
    </main>
  );
}
