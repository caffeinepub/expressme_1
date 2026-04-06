import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { PostCard } from "../components/PostCard";
import type { Page, Post, PostCategory, User } from "../types";

const CATEGORIES: PostCategory[] = [
  "Art & Creativity",
  "Study Buddies",
  "Tech Chat",
  "Hobbies",
];

interface HomePageProps {
  posts: Post[];
  currentUser: User | null;
  onNavigate: (page: Page, category?: PostCategory) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
}

export function HomePage({
  posts,
  currentUser,
  onNavigate,
  onLike,
  onComment,
  onDelete,
}: HomePageProps) {
  const latestPosts = [...posts]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen" data-ocid="home.page">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, var(--hero-gradient-start) 0%, var(--hero-gradient-end) 100%)",
        }}
        data-ocid="home.section"
      >
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24 flex items-center justify-between gap-6">
          {/* Left illustration */}
          <div className="hidden lg:flex items-end justify-center flex-shrink-0 w-48">
            <img
              src="/assets/generated/hero-student-left-transparent.dim_200x320.png"
              alt="Student with phone"
              className="h-56 w-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Center text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Express Yourself, <br />
              Connect with Friends!
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
              A safe space for students aged 11–15 to share ideas, emotions
              &amp; creativity.
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate("forum")}
              className="rounded-full px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              data-ocid="home.primary_button"
            >
              Join the Community
            </Button>
          </motion.div>

          {/* Right illustration */}
          <div className="hidden lg:flex items-end justify-center flex-shrink-0 w-48">
            <img
              src="/assets/generated/hero-student-right-transparent.dim_200x320.png"
              alt="Student with phone"
              className="h-56 w-auto object-contain drop-shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Latest Buzz */}
      <section className="max-w-[1100px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6">
            Latest Buzz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post, i) => (
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
          </div>
        </motion.div>
      </section>

      {/* Forum Categories */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-5">
            Explore Forum Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => onNavigate("forum", cat)}
                data-ocid="home.tab"
                className="px-5 py-2.5 bg-card border border-border rounded-full text-sm font-medium text-foreground shadow-xs hover:shadow-card hover:border-primary/30 hover:bg-secondary/60 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40 py-10">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col gap-1">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                About
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Help Center
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Guidelines
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Contact
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-foreground">ExpressMe 💬</p>
            <p className="text-xs text-muted-foreground mt-1">
              Safe expression for students
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>© {new Date().getFullYear()} ExpressMe</p>
            <p className="text-xs mt-1">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
