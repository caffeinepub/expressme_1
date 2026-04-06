import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Page, User } from "../types";
import { getInitials } from "../utils/helpers";
import { getAvatarColor } from "./PostCard";

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Forum", page: "forum" },
  { label: "Chats", page: "chat" },
  { label: "Upload", page: "upload" },
  { label: "Profile", page: "profile" },
];

interface NavBarProps {
  currentPage: Page;
  currentUser: User;
  onNavigate: (page: Page) => void;
  unreadCount: number;
}

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center leading-none"
      aria-label={`${count} unread messages`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function NavBar({
  currentPage,
  currentUser,
  onNavigate,
  unreadCount,
}: NavBarProps) {
  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-nav"
      data-ocid="nav.section"
    >
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold text-[20px] text-foreground hover:opacity-80 transition-opacity flex-shrink-0"
          data-ocid="nav.link"
        >
          ExpressMe
          <span className="text-[22px]">💬</span>
        </button>

        {/* Nav links */}
        <nav
          className="hidden sm:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.page}
              onClick={() => onNavigate(item.page)}
              data-ocid="nav.tab"
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
              {item.page === "chat" && <UnreadBadge count={unreadCount} />}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 h-8 w-36 rounded-full bg-muted/60 border-border text-sm"
              data-ocid="nav.search_input"
            />
          </div>

          {/* User */}
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            data-ocid="nav.button"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ backgroundColor: getAvatarColor(currentUser.id) }}
            >
              {getInitials(currentUser.displayName)}
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">
              {currentUser.displayName}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.page}
            onClick={() => onNavigate(item.page)}
            data-ocid="nav.tab"
            className={`relative px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              currentPage === item.page
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
            {item.page === "chat" && <UnreadBadge count={unreadCount} />}
          </button>
        ))}
      </div>
    </header>
  );
}
