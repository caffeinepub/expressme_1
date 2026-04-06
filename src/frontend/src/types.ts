export interface User {
  id: string;
  displayName: string;
  handle: string;
  bio: string;
  avatarColor: string;
  joinedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  content: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  title?: string;
  content: string;
  category: PostCategory;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
  createdAt: Date;
}

export type PostCategory =
  | "Art & Creativity"
  | "Study Buddies"
  | "Tech Chat"
  | "Hobbies"
  | "General";

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  content: string;
  createdAt: Date;
  reactions?: Record<string, string[]>;
}

export interface GroupChat {
  id: string;
  name: string;
  memberIds: string[];
  memberNames: string[];
  messages: ChatMessage[];
  createdAt: Date;
  createdById: string;
}

export interface DirectMessage {
  id: string;
  participantIds: [string, string];
  participantNames: [string, string];
  messages: ChatMessage[];
  createdAt: Date;
}

export type Page = "home" | "forum" | "upload" | "profile" | "auth" | "chat";
