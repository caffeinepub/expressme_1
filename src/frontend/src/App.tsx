import { Toaster } from "@/components/ui/sonner";
import { useCallback, useMemo, useState } from "react";
import { NavBar } from "./components/NavBar";
import { INITIAL_POSTS, MOCK_USERS } from "./data/mockData";
import { AuthPage } from "./pages/AuthPage";
import { ChatPage } from "./pages/ChatPage";
import { ForumPage } from "./pages/ForumPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { UploadPage } from "./pages/UploadPage";
import type {
  ChatMessage,
  DirectMessage,
  GroupChat,
  Page,
  Post,
  PostCategory,
  User,
} from "./types";
import { generateId } from "./utils/helpers";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [forumCategory, setForumCategory] = useState<PostCategory | undefined>(
    undefined,
  );
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [lastReadMap, setLastReadMap] = useState<Record<string, Date>>({});

  const handleNavigate = useCallback((page: Page, category?: PostCategory) => {
    setCurrentPage(page);
    if (category !== undefined) {
      setForumCategory(category);
    }
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setCurrentPage("home");
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentPage("auth");
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  }, []);

  const handleComment = useCallback(
    (postId: string, content: string) => {
      if (!currentUser) return;
      const newComment = {
        id: generateId(),
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorHandle: currentUser.handle,
        content,
        createdAt: new Date(),
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
        ),
      );
    },
    [currentUser],
  );

  const handleDeletePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const handleNewPost = useCallback(
    (title: string, category: PostCategory, content: string) => {
      if (!currentUser) return;
      const newPost: Post = {
        id: generateId(),
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorHandle: currentUser.handle,
        title: title || undefined,
        content,
        category,
        likes: 0,
        likedByMe: false,
        comments: [],
        createdAt: new Date(),
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    [currentUser],
  );

  const handleUpdateUser = useCallback(
    (updates: Partial<User>) => {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
      if (updates.displayName) {
        setPosts((prev) =>
          prev.map((p) =>
            p.authorId === currentUser?.id
              ? { ...p, authorName: updates.displayName! }
              : p,
          ),
        );
      }
    },
    [currentUser?.id],
  );

  const handleCreateGroup = useCallback(
    (name: string, memberIds: string[]) => {
      if (!currentUser) return;
      const allMemberIds = Array.from(new Set([currentUser.id, ...memberIds]));
      const allUsers = MOCK_USERS;
      const memberNames = allMemberIds.map(
        (id) =>
          allUsers.find((u) => u.id === id)?.displayName ??
          (id === currentUser.id ? currentUser.displayName : id),
      );
      const newChat: GroupChat = {
        id: generateId(),
        name,
        memberIds: allMemberIds,
        memberNames,
        messages: [],
        createdAt: new Date(),
        createdById: currentUser.id,
      };
      setGroupChats((prev) => [newChat, ...prev]);
    },
    [currentUser],
  );

  const handleSendMessage = useCallback(
    (chatId: string, content: string) => {
      if (!currentUser) return;
      const newMessage: ChatMessage = {
        id: generateId(),
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorHandle: currentUser.handle,
        content,
        createdAt: new Date(),
      };
      setGroupChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, newMessage] } : c,
        ),
      );
    },
    [currentUser],
  );

  const handleMarkRead = useCallback((chatId: string) => {
    setLastReadMap((prev) => ({ ...prev, [chatId]: new Date() }));
  }, []);

  const handleStartDM = useCallback(
    (otherUserId: string): string => {
      if (!currentUser) return "";
      // Check if DM already exists
      const existing = directMessages.find(
        (dm) =>
          dm.participantIds.includes(currentUser.id) &&
          dm.participantIds.includes(otherUserId),
      );
      if (existing) return existing.id;

      // Create new DM
      const otherUser =
        MOCK_USERS.find((u) => u.id === otherUserId) ??
        ({ displayName: otherUserId } as User);
      const newDM: DirectMessage = {
        id: generateId(),
        participantIds: [currentUser.id, otherUserId],
        participantNames: [currentUser.displayName, otherUser.displayName],
        messages: [],
        createdAt: new Date(),
      };
      setDirectMessages((prev) => [newDM, ...prev]);
      return newDM.id;
    },
    [currentUser, directMessages],
  );

  const handleSendDM = useCallback(
    (dmId: string, content: string) => {
      if (!currentUser) return;
      const newMessage: ChatMessage = {
        id: generateId(),
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorHandle: currentUser.handle,
        content,
        createdAt: new Date(),
      };
      setDirectMessages((prev) =>
        prev.map((dm) =>
          dm.id === dmId
            ? { ...dm, messages: [...dm.messages, newMessage] }
            : dm,
        ),
      );
    },
    [currentUser],
  );

  // Compute total unread messages
  const totalUnread = useMemo(() => {
    if (!currentUser) return 0;
    const epoch = new Date(0);
    let count = 0;

    for (const chat of groupChats) {
      if (!chat.memberIds.includes(currentUser.id)) continue;
      const lastRead = lastReadMap[chat.id] ?? epoch;
      for (const msg of chat.messages) {
        if (msg.authorId !== currentUser.id && msg.createdAt > lastRead) {
          count++;
        }
      }
    }

    for (const dm of directMessages) {
      if (!dm.participantIds.includes(currentUser.id)) continue;
      const lastRead = lastReadMap[dm.id] ?? epoch;
      for (const msg of dm.messages) {
        if (msg.authorId !== currentUser.id && msg.createdAt > lastRead) {
          count++;
        }
      }
    }

    return count;
  }, [currentUser, groupChats, directMessages, lastReadMap]);

  // If not logged in, show auth page
  if (!currentUser) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        unreadCount={totalUnread}
      />

      {currentPage === "home" && (
        <HomePage
          posts={posts}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={handleDeletePost}
        />
      )}
      {currentPage === "forum" && (
        <ForumPage
          posts={posts}
          currentUser={currentUser}
          initialCategory={forumCategory}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={handleDeletePost}
        />
      )}
      {currentPage === "chat" && (
        <ChatPage
          currentUser={currentUser}
          groupChats={groupChats}
          directMessages={directMessages}
          allUsers={MOCK_USERS}
          onCreateGroup={handleCreateGroup}
          onSendMessage={handleSendMessage}
          onStartDM={handleStartDM}
          onSendDM={handleSendDM}
          onMarkRead={handleMarkRead}
          lastReadMap={lastReadMap}
        />
      )}
      {currentPage === "upload" && (
        <UploadPage onPost={handleNewPost} onNavigate={handleNavigate} />
      )}
      {currentPage === "profile" && (
        <ProfilePage
          currentUser={currentUser}
          posts={posts}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={handleDeletePost}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}
