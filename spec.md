# ExpressMe

## Current State
The app has group chat functionality in ChatPage.tsx. Users can create group chats with multiple participants and send messages. The NavBar has a "Chats" link with no notification badge. App.tsx manages `groupChats` state, handles `onCreateGroup` and `onSendMessage`.

## Requested Changes (Diff)

### Add
- `DirectMessage` type: id, participantIds (2 users), participantNames, messages (ChatMessage[]), createdAt
- Direct message (1-on-1) conversations — accessible from the same "Chats" page
- Ability to start a new DM with any other user (pick from a list)
- `unreadCounts` tracking: track the number of unread messages per chat (both group and DM) for the current user. A message is "unread" if it was sent after the user last viewed that chat.
- Notification badge on the "Chats" nav item showing total unread count across all chats (group + DM), hidden when count is 0

### Modify
- `types.ts`: add `DirectMessage` type; add optional `lastReadAt?: Date` per-chat per-user tracking or a simpler `unreadCount` field
- `ChatPage.tsx`: redesign to show two tabs "Groups" and "Direct Messages" (or a unified list with type indicators). Show unread badge per conversation in the list. Mark chat as read when opened.
- `NavBar.tsx`: add a red/primary-colored numeric badge on the "Chats" nav button when there are unread messages
- `App.tsx`: add `directMessages` state, `handleStartDM`, `handleSendDM` handlers; compute total unread count and pass to NavBar; track last-read timestamps per chat

### Remove
- Nothing removed

## Implementation Plan
1. Add `DirectMessage` type to `types.ts`
2. In `App.tsx`: add `directMessages` state; add `lastReadMap` state (Record<chatId, Date>) to track when user last read each chat; add `handleStartDM(userId)` that creates or opens an existing DM; add `handleSendDM(dmId, content)`; compute `totalUnread` from group chats + DMs based on messages after lastReadMap entry; pass `totalUnread` and `onMarkRead(chatId)` down
3. In `NavBar.tsx`: accept `unreadCount` prop; render a small badge on the Chats tab when > 0
4. In `ChatPage.tsx`: add tab UI (Groups / Direct Messages); add "New DM" button to start a DM with a user; show per-chat unread badges in list; call `onMarkRead` when opening a chat; wire DM send/receive
