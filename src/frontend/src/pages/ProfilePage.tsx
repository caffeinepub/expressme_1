import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { PostCard } from "../components/PostCard";
import { getAvatarColor } from "../components/PostCard";
import type { Post, User } from "../types";
import { getInitials } from "../utils/helpers";

interface ProfilePageProps {
  currentUser: User;
  posts: Post[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
}

export function ProfilePage({
  currentUser,
  posts,
  onLike,
  onComment,
  onDelete,
  onUpdateUser,
  onLogout,
}: ProfilePageProps) {
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser.bio);
  const [editingName, setEditingName] = useState(false);
  const [nameText, setNameText] = useState(currentUser.displayName);

  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  const totalLikes = myPosts.reduce((sum, p) => sum + p.likes, 0);

  const saveBio = () => {
    onUpdateUser({ bio: bioText.trim() });
    setEditingBio(false);
    toast.success("Bio updated!");
  };

  const saveName = () => {
    if (!nameText.trim()) return;
    onUpdateUser({ displayName: nameText.trim() });
    setEditingName(false);
    toast.success("Display name updated!");
  };

  return (
    <main className="max-w-[900px] mx-auto px-6 py-10" data-ocid="profile.page">
      {/* Profile header */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-card rounded-2xl border border-border shadow-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8"
        data-ocid="profile.section"
      >
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0"
          style={{ backgroundColor: getAvatarColor(currentUser.id) }}
        >
          {getInitials(currentUser.displayName)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="font-bold text-2xl text-foreground">
            {currentUser.displayName}
          </p>
          <p className="text-muted-foreground text-sm mb-3">
            @{currentUser.handle}
          </p>

          {/* Bio */}
          {editingBio ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="text-sm resize-none min-h-[72px] rounded-xl"
                maxLength={200}
                data-ocid="profile.textarea"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={saveBio}
                  className="rounded-full h-8"
                  data-ocid="profile.save_button"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setBioText(currentUser.bio);
                    setEditingBio(false);
                  }}
                  className="rounded-full h-8"
                  data-ocid="profile.cancel_button"
                >
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 justify-center sm:justify-start">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {currentUser.bio ||
                  "No bio yet. Click the edit button to add one!"}
              </p>
              <button
                type="button"
                onClick={() => setEditingBio(true)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                data-ocid="profile.edit_button"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 mt-4 justify-center sm:justify-start">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">
                {myPosts.length}
              </p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{totalLikes}</p>
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">
                {posts.reduce((sum, p) => sum + p.comments.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* My Posts */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="text-xl font-bold text-foreground mb-5">My Posts</h2>
        {myPosts.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-border"
            data-ocid="profile.empty_state"
          >
            <p className="text-4xl mb-3">✍️</p>
            <p className="font-medium">No posts yet!</p>
            <p className="text-sm mt-1">
              Go to Upload to share your first post.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="profile.list"
          >
            {myPosts.map((post, i) => (
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
        )}
      </motion.section>

      <Separator className="my-8" />

      {/* Settings */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="bg-card rounded-2xl border border-border shadow-card p-6"
        data-ocid="profile.card"
      >
        <h2 className="text-lg font-bold text-foreground mb-5">Settings</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-name" className="text-sm font-medium">
              Display Name
            </Label>
            {editingName ? (
              <div className="flex gap-2">
                <Input
                  id="settings-name"
                  value={nameText}
                  onChange={(e) => setNameText(e.target.value)}
                  className="rounded-xl flex-1"
                  data-ocid="profile.input"
                />
                <Button
                  size="sm"
                  onClick={saveName}
                  className="rounded-xl"
                  data-ocid="profile.save_button"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNameText(currentUser.displayName);
                    setEditingName(false);
                  }}
                  className="rounded-xl"
                  data-ocid="profile.cancel_button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="settings-name"
                  value={currentUser.displayName}
                  readOnly
                  className="rounded-xl flex-1 bg-muted/40"
                  data-ocid="profile.input"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingName(true)}
                  className="rounded-xl"
                  data-ocid="profile.edit_button"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Username</Label>
            <Input
              value={`@${currentUser.handle}`}
              readOnly
              className="rounded-xl bg-muted/40"
            />
          </div>

          <Button
            variant="destructive"
            onClick={onLogout}
            className="rounded-full mt-2 w-fit"
            data-ocid="profile.button"
          >
            Log Out
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
