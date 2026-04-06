import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page, PostCategory } from "../types";

const CATEGORIES: PostCategory[] = [
  "Art & Creativity",
  "Study Buddies",
  "Tech Chat",
  "Hobbies",
  "General",
];

const MAX_CONTENT = 500;
const MIN_CONTENT = 10;

interface UploadPageProps {
  onPost: (title: string, category: PostCategory, content: string) => void;
  onNavigate: (page: Page) => void;
}

export function UploadPage({ onPost, onNavigate }: UploadPageProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!category) errs.category = "Please choose a category.";
    if (content.trim().length < MIN_CONTENT)
      errs.content = `Content must be at least ${MIN_CONTENT} characters.`;
    if (content.length > MAX_CONTENT)
      errs.content = `Content must be under ${MAX_CONTENT} characters.`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onPost(title.trim(), category as PostCategory, content.trim());
    toast.success("Post shared! 🎉", {
      description: "Your post is now live on the forum.",
    });
    onNavigate("forum");
  };

  return (
    <main className="max-w-[600px] mx-auto px-6 py-12" data-ocid="upload.page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Share Something
            </h1>
            <p className="text-muted-foreground text-sm">
              Express yourself to the community
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col gap-5"
          data-ocid="upload.section"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-title" className="text-sm font-medium">
              Title{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title…"
              className="rounded-xl"
              data-ocid="upload.input"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-category" className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(val) => {
                setCategory(val as PostCategory);
                setErrors((prev) => ({ ...prev, category: "" }));
              }}
            >
              <SelectTrigger
                id="post-category"
                className="rounded-xl"
                data-ocid="upload.select"
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p
                className="text-destructive text-xs"
                data-ocid="upload.error_state"
              >
                {errors.category}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-content" className="text-sm font-medium">
                What&apos;s on your mind?{" "}
                <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs ${
                  content.length > MAX_CONTENT
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {content.length}/{MAX_CONTENT}
              </span>
            </div>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content)
                  setErrors((prev) => ({ ...prev, content: "" }));
              }}
              placeholder="Share your ideas, feelings, or a cool thing you learned today…"
              className="min-h-[160px] resize-y rounded-xl text-sm"
              data-ocid="upload.textarea"
            />
            {errors.content && (
              <p
                className="text-destructive text-xs"
                data-ocid="upload.error_state"
              >
                {errors.content}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="rounded-full font-semibold mt-1"
            data-ocid="upload.submit_button"
          >
            Post It! 🚀
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
