# ExpressMe

## Current State
- 6 mock users in mockData.ts
- ChatPage supports group chats and DMs with full messaging UI
- No online presence indicators
- No emoji reactions on messages
- types.ts defines ChatMessage, GroupChat, DirectMessage

## Requested Changes (Diff)

### Add
- Online presence system: simulated onlineUserIds set (randomly assigned on load, toggling every ~30s), displayed as green dot on avatars in chat lists and inside chat rooms
- 'X online' pill in group chat headers
- Emoji reactions on messages: hover to reveal picker (6 emojis), reactions shown as pill badges below messages with counts, clicking toggles
- 4 new mock users (total = 10)
- ChatMessage.reactions optional field: Record<string, string[]>

### Modify
- types.ts: add reactions field to ChatMessage
- App.tsx: add onlineUserIds state + reaction handlers, pass to ChatPage
- ChatPage: render online dots, reaction picker, reaction badges
- mockData.ts: add 4 more users

### Remove
- Nothing

## Implementation Plan
1. Update types.ts
2. Add 4 users to mockData.ts
3. Add online simulation + reaction state in App.tsx
4. Update ChatPage with online dots and emoji reactions UI
