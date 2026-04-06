import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  MessageCircle,
  Plus,
  Send,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import type { DirectMessage, GroupChat, User } from "../types";
import { getInitials } from "../utils/helpers";

const AVATAR_PALETTE = [
  "#6FA3C8",
  "#8EC9A4",
  "#E8956D",
  "#C47BC8",
  "#7BBFE8",
  "#E8C46D",
];

function avatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getUnreadCount(
  messages: { authorId: string; createdAt: Date }[],
  currentUserId: string,
  lastRead: Date | undefined,
): number {
  const epoch = new Date(0);
  const cutoff = lastRead ?? epoch;
  return messages.filter(
    (m) => m.authorId !== currentUserId && m.createdAt > cutoff,
  ).length;
}

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

interface OnlineDotProps {
  isOnline: boolean;
  size?: "sm" | "md";
}

function OnlineDot({ isOnline, size = "sm" }: OnlineDotProps) {
  if (!isOnline) return null;
  const sizeCls = size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";
  return (
    <span
      className={`absolute bottom-0 right-0 ${sizeCls} rounded-full bg-green-500 border-2 border-background`}
      aria-label="Online"
    />
  );
}

interface ChatPageProps {
  currentUser: User;
  groupChats: GroupChat[];
  directMessages: DirectMessage[];
  allUsers: User[];
  onCreateGroup: (name: string, memberIds: string[]) => void;
  onSendMessage: (chatId: string, content: string) => void;
  onStartDM: (otherUserId: string) => string;
  onSendDM: (dmId: string, content: string) => void;
  onMarkRead: (chatId: string) => void;
  lastReadMap: Record<string, Date>;
  onlineUserIds: Set<string>;
  onReactToMessage: (
    chatType: "group" | "dm",
    chatId: string,
    messageId: string,
    emoji: string,
    userId: string,
  ) => void;
}

type ActiveChat =
  | { type: "group"; id: string }
  | { type: "dm"; id: string }
  | null;

type TabType = "groups" | "dms";

export function ChatPage({
  currentUser,
  groupChats,
  directMessages,
  allUsers,
  onCreateGroup,
  onSendMessage,
  onStartDM,
  onSendDM,
  onMarkRead,
  lastReadMap,
  onlineUserIds,
  onReactToMessage,
}: ChatPageProps) {
  const [activeChat, setActiveChat] = useState<ActiveChat>(null);
  const [activeTab, setActiveTab] = useState<TabType>("groups");
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [showNewDMDialog, setShowNewDMDialog] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedDMUserId, setSelectedDMUserId] = useState<string | null>(null);
  const [groupNameError, setGroupNameError] = useState("");
  const [membersError, setMembersError] = useState("");
  const [dmUserError, setDMUserError] = useState("");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myGroupChats = groupChats.filter((c) =>
    c.memberIds.includes(currentUser.id),
  );
  const myDMs = directMessages.filter((dm) =>
    dm.participantIds.includes(currentUser.id),
  );

  const activeChatData =
    activeChat?.type === "group"
      ? (myGroupChats.find((c) => c.id === activeChat.id) ?? null)
      : null;
  const activeDMData =
    activeChat?.type === "dm"
      ? (myDMs.find((dm) => dm.id === activeChat.id) ?? null)
      : null;

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function openGroupChat(chatId: string) {
    setActiveChat({ type: "group", id: chatId });
    onMarkRead(chatId);
  }

  function openDMChat(dmId: string) {
    setActiveChat({ type: "dm", id: dmId });
    onMarkRead(dmId);
  }

  function handleSend() {
    if (!activeChat || !messageInput.trim()) return;
    if (activeChat.type === "group") {
      onSendMessage(activeChat.id, messageInput.trim());
    } else {
      onSendDM(activeChat.id, messageInput.trim());
    }
    setMessageInput("");
    scrollToBottom();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function toggleMember(userId: string) {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
    setMembersError("");
  }

  function handleCreateGroup() {
    let valid = true;
    if (!groupName.trim()) {
      setGroupNameError("Group name is required.");
      valid = false;
    }
    if (selectedMemberIds.length === 0) {
      setMembersError("Select at least one member.");
      valid = false;
    }
    if (!valid) return;
    onCreateGroup(groupName.trim(), selectedMemberIds);
    setGroupName("");
    setSelectedMemberIds([]);
    setGroupNameError("");
    setMembersError("");
    setShowNewGroupDialog(false);
  }

  function handleGroupDialogClose(open: boolean) {
    if (!open) {
      setShowNewGroupDialog(false);
      setGroupName("");
      setSelectedMemberIds([]);
      setGroupNameError("");
      setMembersError("");
    }
  }

  function handleStartDM() {
    if (!selectedDMUserId) {
      setDMUserError("Please select a person to message.");
      return;
    }
    const dmId = onStartDM(selectedDMUserId);
    setShowNewDMDialog(false);
    setSelectedDMUserId(null);
    setDMUserError("");
    openDMChat(dmId);
  }

  function handleDMDialogClose(open: boolean) {
    if (!open) {
      setShowNewDMDialog(false);
      setSelectedDMUserId(null);
      setDMUserError("");
    }
  }

  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id);

  // Compute DM unread count for tab badge
  const dmTabUnread = (() => {
    const epoch = new Date(0);
    return myDMs.reduce((total, dm) => {
      const lastRead = lastReadMap[dm.id] ?? epoch;
      return (
        total +
        dm.messages.filter(
          (m) => m.authorId !== currentUser.id && m.createdAt > lastRead,
        ).length
      );
    }, 0);
  })();

  // Renders reaction pills below a message
  function renderReactions(
    msg: { id: string; reactions?: Record<string, string[]> },
    chatType: "group" | "dm",
    chatId: string,
    isMe: boolean,
  ) {
    const reactions = msg.reactions;
    if (!reactions || Object.keys(reactions).length === 0) return null;
    return (
      <div
        className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
      >
        {Object.entries(reactions).map(([emoji, userIds]) => {
          const iReacted = userIds.includes(currentUser.id);
          return (
            <button
              type="button"
              key={emoji}
              onClick={() =>
                onReactToMessage(
                  chatType,
                  chatId,
                  msg.id,
                  emoji,
                  currentUser.id,
                )
              }
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                iReacted
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-secondary/80 text-foreground border border-border hover:bg-secondary"
              }`}
            >
              <span>{emoji}</span>
              <span>{userIds.length}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Renders the floating emoji picker on hover
  function renderEmojiPicker(
    msgId: string,
    chatType: "group" | "dm",
    chatId: string,
    isMe: boolean,
  ) {
    if (hoveredMessageId !== msgId) return null;
    return (
      <div
        className={`absolute -top-9 ${
          isMe ? "right-0" : "left-0"
        } flex items-center gap-0.5 bg-card border border-border rounded-full px-2 py-1 shadow-md z-10`}
        onMouseEnter={() => setHoveredMessageId(msgId)}
        onMouseLeave={() => setHoveredMessageId(null)}
      >
        {EMOJI_REACTIONS.map((emoji) => (
          <button
            type="button"
            key={emoji}
            onClick={() =>
              onReactToMessage(chatType, chatId, msgId, emoji, currentUser.id)
            }
            className="text-base leading-none hover:scale-125 transition-transform px-0.5 py-0.5 rounded"
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }

  // --- Chat Room View (Group) ---
  if (activeChatData) {
    const onlineMemberCount = activeChatData.memberIds.filter((id) =>
      onlineUserIds.has(id),
    ).length;

    return (
      <main
        className="max-w-[760px] mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]"
        data-ocid="chat.section"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setActiveChat(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors flex-shrink-0"
            aria-label="Back to chats"
            data-ocid="chat.back_button"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {activeChatData.name}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {activeChatData.memberIds.length} member
                {activeChatData.memberIds.length !== 1 ? "s" : ""}
              </p>
              {onlineMemberCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  {onlineMemberCount} online
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ScrollArea className="h-full p-4">
            {activeChatData.messages.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-40 gap-2"
                data-ocid="chat.empty_state"
              >
                <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No messages yet — say hi! 👋
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeChatData.messages.map((msg, i) => {
                  const isMe = msg.authorId === currentUser.id;
                  const isOnline = onlineUserIds.has(msg.authorId);
                  return (
                    <div
                      key={msg.id}
                      data-ocid={`chat.item.${i + 1}`}
                      className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                          style={{ backgroundColor: avatarColor(msg.authorId) }}
                        >
                          {getInitials(msg.authorName)}
                        </div>
                        <OnlineDot isOnline={isOnline} />
                      </div>
                      <div
                        className={`max-w-[70%] flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-baseline gap-2">
                          {!isMe && (
                            <span className="text-xs font-semibold text-foreground">
                              {msg.authorName}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                        <div
                          className="relative"
                          onMouseEnter={() => setHoveredMessageId(msg.id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          {renderEmojiPicker(
                            msg.id,
                            "group",
                            activeChatData.id,
                            isMe,
                          )}
                          <div
                            className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-secondary text-secondary-foreground rounded-tl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                        {renderReactions(msg, "group", activeChatData.id, isMe)}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="mt-3 flex gap-2 items-center">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-card border-border"
            data-ocid="chat.input"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            data-ocid="chat.submit_button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    );
  }

  // --- Chat Room View (DM) ---
  if (activeDMData) {
    const otherIndex =
      activeDMData.participantIds[0] === currentUser.id ? 1 : 0;
    const otherName = activeDMData.participantNames[otherIndex];
    const otherId = activeDMData.participantIds[otherIndex];
    const isOtherOnline = onlineUserIds.has(otherId);

    return (
      <main
        className="max-w-[760px] mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]"
        data-ocid="chat.section"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setActiveChat(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors flex-shrink-0"
            aria-label="Back to chats"
            data-ocid="chat.back_button"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: avatarColor(otherId) }}
            >
              {getInitials(otherName)}
            </div>
            <OnlineDot isOnline={isOtherOnline} size="md" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {otherName}
            </h1>
            {isOtherOnline ? (
              <p className="text-xs text-green-600 font-medium">Online</p>
            ) : (
              <p className="text-xs text-muted-foreground">Offline</p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ScrollArea className="h-full p-4">
            {activeDMData.messages.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-40 gap-2"
                data-ocid="chat.empty_state"
              >
                <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Start your conversation with {otherName}! 👋
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeDMData.messages.map((msg, i) => {
                  const isMe = msg.authorId === currentUser.id;
                  const isOnline = onlineUserIds.has(msg.authorId);
                  return (
                    <div
                      key={msg.id}
                      data-ocid={`chat.item.${i + 1}`}
                      className={`flex gap-2.5 ${
                        isMe ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                          style={{ backgroundColor: avatarColor(msg.authorId) }}
                        >
                          {getInitials(msg.authorName)}
                        </div>
                        <OnlineDot isOnline={isOnline} />
                      </div>
                      <div
                        className={`max-w-[70%] flex flex-col gap-0.5 ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(msg.createdAt)}
                        </span>
                        <div
                          className="relative"
                          onMouseEnter={() => setHoveredMessageId(msg.id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          {renderEmojiPicker(
                            msg.id,
                            "dm",
                            activeDMData.id,
                            isMe,
                          )}
                          <div
                            className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-secondary text-secondary-foreground rounded-tl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                        {renderReactions(msg, "dm", activeDMData.id, isMe)}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="mt-3 flex gap-2 items-center">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${otherName}...`}
            className="flex-1 rounded-full bg-card border-border"
            data-ocid="chat.input"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            data-ocid="chat.submit_button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    );
  }

  // --- Chat List View ---
  return (
    <main className="max-w-[760px] mx-auto px-4 py-6" data-ocid="chat.section">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Chat with friends, one-on-one or in groups
          </p>
        </div>
        {activeTab === "groups" ? (
          <Button
            onClick={() => setShowNewGroupDialog(true)}
            className="gap-2 rounded-full bg-primary hover:bg-primary/90"
            data-ocid="chat.open_modal_button"
          >
            <Plus className="h-4 w-4" />
            New Group
          </Button>
        ) : (
          <Button
            onClick={() => setShowNewDMDialog(true)}
            className="gap-2 rounded-full bg-primary hover:bg-primary/90"
            data-ocid="chat.open_modal_button"
          >
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        )}
      </div>

      {/* Tab switcher */}
      <div
        className="flex gap-1 p-1 rounded-full bg-muted w-fit mb-5"
        data-ocid="chat.tab"
      >
        <button
          type="button"
          onClick={() => setActiveTab("groups")}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === "groups"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Groups
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dms")}
          className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === "dms"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Direct Messages
          {dmTabUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center">
              {dmTabUnread > 9 ? "9+" : dmTabUnread}
            </span>
          )}
        </button>
      </div>

      {/* Groups tab */}
      {activeTab === "groups" &&
        (myGroupChats.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4"
            data-ocid="chat.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">
                No group chats yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new group to start chatting with friends!
              </p>
            </div>
            <Button
              onClick={() => setShowNewGroupDialog(true)}
              variant="outline"
              className="gap-2 rounded-full border-primary text-primary hover:bg-secondary"
              data-ocid="chat.primary_button"
            >
              <Plus className="h-4 w-4" />
              Create your first group
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myGroupChats.map((chat, i) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const unread = getUnreadCount(
                chat.messages,
                currentUser.id,
                lastReadMap[chat.id],
              );
              const onlineCount = chat.memberIds.filter((id) =>
                onlineUserIds.has(id),
              ).length;
              return (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => openGroupChat(chat.id)}
                  data-ocid={`chat.item.${i + 1}`}
                  className="w-full text-left bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground truncate">
                          {chat.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lastMsg && (
                            <span className="text-[11px] text-muted-foreground">
                              {formatTime(lastMsg.createdAt)}
                            </span>
                          )}
                          {unread > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                              {unread > 9 ? "9+" : unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {lastMsg
                          ? `${lastMsg.authorName}: ${lastMsg.content}`
                          : "No messages yet"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground/70" />
                          <span className="text-[11px] text-muted-foreground/70">
                            {chat.memberIds.length} member
                            {chat.memberIds.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {onlineCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            {onlineCount} online
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}

      {/* DMs tab */}
      {activeTab === "dms" &&
        (myDMs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4"
            data-ocid="chat.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">
                No direct messages yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a private conversation with a friend!
              </p>
            </div>
            <Button
              onClick={() => setShowNewDMDialog(true)}
              variant="outline"
              className="gap-2 rounded-full border-primary text-primary hover:bg-secondary"
              data-ocid="chat.primary_button"
            >
              <Plus className="h-4 w-4" />
              Send your first message
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myDMs.map((dm, i) => {
              const otherIndex =
                dm.participantIds[0] === currentUser.id ? 1 : 0;
              const otherName = dm.participantNames[otherIndex];
              const otherId = dm.participantIds[otherIndex];
              const lastMsg = dm.messages[dm.messages.length - 1];
              const unread = getUnreadCount(
                dm.messages,
                currentUser.id,
                lastReadMap[dm.id],
              );
              const isOtherOnline = onlineUserIds.has(otherId);
              return (
                <button
                  type="button"
                  key={dm.id}
                  onClick={() => openDMChat(dm.id)}
                  data-ocid={`chat.item.${i + 1}`}
                  className="w-full text-left bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: avatarColor(otherId) }}
                      >
                        {getInitials(otherName)}
                      </div>
                      <OnlineDot isOnline={isOtherOnline} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-foreground truncate">
                            {otherName}
                          </span>
                          {isOtherOnline && (
                            <span className="text-[10px] text-green-600 font-medium whitespace-nowrap">
                              Online
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lastMsg && (
                            <span className="text-[11px] text-muted-foreground">
                              {formatTime(lastMsg.createdAt)}
                            </span>
                          )}
                          {unread > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                              {unread > 9 ? "9+" : unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {lastMsg
                          ? `${
                              lastMsg.authorId === currentUser.id
                                ? "You"
                                : otherName
                            }: ${lastMsg.content}`
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}

      {/* New Group Dialog */}
      <Dialog open={showNewGroupDialog} onOpenChange={handleGroupDialogClose}>
        <DialogContent className="sm:max-w-[420px]" data-ocid="chat.dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Create New Group
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="group-name" className="text-sm font-medium">
                Group Name
              </Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  setGroupNameError("");
                }}
                placeholder="e.g. Study Squad 📚"
                className="rounded-xl"
                data-ocid="chat.input"
              />
              {groupNameError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="chat.error_state"
                >
                  {groupNameError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Add Members</Label>
              <ScrollArea className="max-h-60">
                <div className="rounded-xl border border-border overflow-hidden">
                  {otherUsers.map((user) => (
                    <label
                      key={user.id}
                      htmlFor={`member-${user.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 cursor-pointer transition-colors border-b border-border last:border-b-0"
                    >
                      <Checkbox
                        id={`member-${user.id}`}
                        checked={selectedMemberIds.includes(user.id)}
                        onCheckedChange={() => toggleMember(user.id)}
                        data-ocid="chat.checkbox"
                      />
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ backgroundColor: avatarColor(user.id) }}
                        >
                          {getInitials(user.displayName)}
                        </div>
                        <OnlineDot isOnline={onlineUserIds.has(user.id)} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground truncate">
                            {user.displayName}
                          </span>
                          {onlineUserIds.has(user.id) && (
                            <span className="text-[10px] text-green-600 font-medium">
                              ●
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                          @{user.handle}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </ScrollArea>
              {membersError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="chat.error_state"
                >
                  {membersError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => handleGroupDialogClose(false)}
              className="rounded-full flex-1"
              data-ocid="chat.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              className="rounded-full flex-1 bg-primary hover:bg-primary/90"
              data-ocid="chat.confirm_button"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New DM Dialog */}
      <Dialog open={showNewDMDialog} onOpenChange={handleDMDialogClose}>
        <DialogContent className="sm:max-w-[420px]" data-ocid="chat.dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">New Message</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <Label className="text-sm font-medium">Choose a person</Label>
            <ScrollArea className="max-h-64">
              <div className="rounded-xl border border-border overflow-hidden">
                {otherUsers.map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    onClick={() => {
                      setSelectedDMUserId(user.id);
                      setDMUserError("");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 cursor-pointer transition-colors border-b border-border last:border-b-0 text-left ${
                      selectedDMUserId === user.id ? "bg-secondary/80" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: avatarColor(user.id) }}
                      >
                        {getInitials(user.displayName)}
                      </div>
                      <OnlineDot isOnline={onlineUserIds.has(user.id)} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {user.displayName}
                        </span>
                        {onlineUserIds.has(user.id) && (
                          <span className="text-[10px] text-green-600 font-medium">
                            Online
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        @{user.handle}
                      </span>
                    </div>
                    {selectedDMUserId === user.id && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
            {dmUserError && (
              <p
                className="text-xs text-destructive"
                data-ocid="chat.error_state"
              >
                {dmUserError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => handleDMDialogClose(false)}
              className="rounded-full flex-1"
              data-ocid="chat.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartDM}
              className="rounded-full flex-1 bg-primary hover:bg-primary/90"
              data-ocid="chat.confirm_button"
            >
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
