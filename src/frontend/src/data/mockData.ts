import type { Post, User } from "../types";

export const AVATAR_COLORS = [
  "#6FA3C8",
  "#8EC9A4",
  "#E8956D",
  "#C47BC8",
  "#7BBFE8",
  "#E8C46D",
];

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    displayName: "Alex B.",
    handle: "alex_b",
    bio: "Hey there! I love coding and playing video games. Always up for a good tech chat! 🎮",
    avatarColor: AVATAR_COLORS[0],
    joinedAt: new Date("2025-09-01"),
  },
  {
    id: "u2",
    displayName: "Mia J.",
    handle: "mia_j",
    bio: "Artist and daydreamer. I sketch, paint, and sometimes write poetry ✨",
    avatarColor: AVATAR_COLORS[1],
    joinedAt: new Date("2025-09-05"),
  },
  {
    id: "u3",
    displayName: "Cool Coder",
    handle: "cool_coder",
    bio: "Building cool stuff one line at a time. Python enthusiast 🐍",
    avatarColor: AVATAR_COLORS[2],
    joinedAt: new Date("2025-09-10"),
  },
  {
    id: "u4",
    displayName: "Artsy Anna",
    handle: "artsy_anna",
    bio: "Watercolors, digital art, and everything in between. Let's create! 🎨",
    avatarColor: AVATAR_COLORS[3],
    joinedAt: new Date("2025-10-01"),
  },
  {
    id: "u5",
    displayName: "Sports Sam",
    handle: "sports_sam",
    bio: "Football fanatic and track runner. Fitness is life 🏃‍♂️",
    avatarColor: AVATAR_COLORS[4],
    joinedAt: new Date("2025-10-15"),
  },
  {
    id: "u6",
    displayName: "Bookworm Bee",
    handle: "bookworm_bee",
    bio: "Currently reading: everything. Book recommendations always welcome 📚",
    avatarColor: AVATAR_COLORS[5],
    joinedAt: new Date("2025-11-01"),
  },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d: number) =>
  new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

export const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    authorId: "u4",
    authorName: "Artsy Anna",
    authorHandle: "artsy_anna",
    title: "My first watercolor sunset 🌅",
    content:
      "Finally finished my first watercolor painting! It took me three days but I'm so proud of how the sunset colors came out. The blending technique I learned from a YouTube tutorial really made a difference. Has anyone else tried watercolors for the first time recently?",
    category: "Art & Creativity",
    likes: 24,
    likedByMe: false,
    comments: [
      {
        id: "c1",
        authorId: "u2",
        authorName: "Mia J.",
        authorHandle: "mia_j",
        content: "This sounds so beautiful! You should share a photo 😍",
        createdAt: hoursAgo(5),
      },
      {
        id: "c2",
        authorId: "u6",
        authorName: "Bookworm Bee",
        authorHandle: "bookworm_bee",
        content:
          "Watercolors are so tricky to get right. Congrats on mastering the blend!",
        createdAt: hoursAgo(3),
      },
    ],
    createdAt: hoursAgo(8),
  },
  {
    id: "p2",
    authorId: "u3",
    authorName: "Cool Coder",
    authorHandle: "cool_coder",
    title: "Built a simple calculator in Python!",
    content:
      "Just finished my first Python project — a command-line calculator that handles basic math operations and even remembers your last calculation. Took about 2 hours and I learned so much about functions and input validation. If anyone wants to see the code, let me know!",
    category: "Tech Chat",
    likes: 31,
    likedByMe: false,
    comments: [
      {
        id: "c3",
        authorId: "u1",
        authorName: "Alex B.",
        authorHandle: "alex_b",
        content: "That's awesome! Python is such a great starting language 🐍",
        createdAt: hoursAgo(12),
      },
      {
        id: "c4",
        authorId: "u3",
        authorName: "Cool Coder",
        authorHandle: "cool_coder",
        content: "Thanks! Going to try building a quiz game next!",
        createdAt: hoursAgo(10),
      },
      {
        id: "c5",
        authorId: "u4",
        authorName: "Artsy Anna",
        authorHandle: "artsy_anna",
        content: "I'd love to see the code! Maybe I can learn too 😊",
        createdAt: hoursAgo(9),
      },
    ],
    createdAt: hoursAgo(15),
  },
  {
    id: "p3",
    authorId: "u6",
    authorName: "Bookworm Bee",
    authorHandle: "bookworm_bee",
    title: "Reading challenge: 50 books this year!",
    content:
      "I set a goal to read 50 books this year and I'm already at 38! Right now I'm reading 'The Hitchhiker's Guide to the Galaxy' and it's absolutely hilarious. What are you all reading? I need more recommendations for the final stretch!",
    category: "Hobbies",
    likes: 17,
    likedByMe: false,
    comments: [
      {
        id: "c6",
        authorId: "u2",
        authorName: "Mia J.",
        authorHandle: "mia_j",
        content:
          "50 books?! You're amazing! I'd recommend 'Percy Jackson' if you haven't read it!",
        createdAt: hoursAgo(20),
      },
      {
        id: "c7",
        authorId: "u5",
        authorName: "Sports Sam",
        authorHandle: "sports_sam",
        content: "I need to read more. Maybe I'll try audiobooks while I run!",
        createdAt: hoursAgo(18),
      },
    ],
    createdAt: daysAgo(1),
  },
  {
    id: "p4",
    authorId: "u5",
    authorName: "Sports Sam",
    authorHandle: "sports_sam",
    title: "Ran my first 5K this morning! 🏃",
    content:
      "Just completed my first ever 5K run! Finished in 28 minutes which I'm really happy with for a beginner. My legs are jelly right now but the feeling after crossing the finish line was incredible. Training for weeks finally paid off. Who else is into running?",
    category: "Hobbies",
    likes: 42,
    likedByMe: false,
    comments: [
      {
        id: "c8",
        authorId: "u1",
        authorName: "Alex B.",
        authorHandle: "alex_b",
        content: "28 minutes is great for a first 5K! Keep it up! 💪",
        createdAt: daysAgo(1),
      },
      {
        id: "c9",
        authorId: "u6",
        authorName: "Bookworm Bee",
        authorHandle: "bookworm_bee",
        content: "That's so inspiring! Maybe I should start running too...",
        createdAt: daysAgo(1),
      },
    ],
    createdAt: daysAgo(2),
  },
  {
    id: "p5",
    authorId: "u2",
    authorName: "Mia J.",
    authorHandle: "mia_j",
    title: "Study tips that actually work!",
    content:
      "After struggling with exams last semester, I tried the Pomodoro technique — 25 minutes study, 5 minute break. It completely changed how I work! I'm retaining so much more information and feeling less stressed. Also making colorful mind maps for each subject has been a huge help. Anyone else have study tricks to share?",
    category: "Study Buddies",
    likes: 55,
    likedByMe: false,
    comments: [
      {
        id: "c10",
        authorId: "u3",
        authorName: "Cool Coder",
        authorHandle: "cool_coder",
        content:
          "The Pomodoro technique is a lifesaver! I use it for coding too.",
        createdAt: daysAgo(2),
      },
      {
        id: "c11",
        authorId: "u4",
        authorName: "Artsy Anna",
        authorHandle: "artsy_anna",
        content:
          "Mind maps are so good! I draw mine with color-coded branches ✏️",
        createdAt: daysAgo(2),
      },
      {
        id: "c12",
        authorId: "u5",
        authorName: "Sports Sam",
        authorHandle: "sports_sam",
        content: "Going to try this before my science test on Friday. Thanks!",
        createdAt: daysAgo(2),
      },
    ],
    createdAt: daysAgo(3),
  },
  {
    id: "p6",
    authorId: "u1",
    authorName: "Alex B.",
    authorHandle: "alex_b",
    title: "My favorite game of the year 🎮",
    content:
      "Just finished the main story of Hollow Knight and wow, what a masterpiece! The world design, the music, the difficulty — everything just works perfectly. It's made by a tiny team of 3 people which makes it even more impressive. If you haven't played it, I really recommend it. What games are you all playing right now?",
    category: "Tech Chat",
    likes: 28,
    likedByMe: false,
    comments: [
      {
        id: "c13",
        authorId: "u3",
        authorName: "Cool Coder",
        authorHandle: "cool_coder",
        content:
          "Hollow Knight is incredible! The Godhome DLC is brutal though 😅",
        createdAt: daysAgo(3),
      },
    ],
    createdAt: daysAgo(4),
  },
  {
    id: "p7",
    authorId: "u2",
    authorName: "Mia J.",
    authorHandle: "mia_j",
    content:
      "Started learning digital art on my tablet this week! It's so different from traditional drawing — undo button saves my life every five minutes 😂. Using Procreate and slowly getting the hang of layers. Any digital artists here with beginner tips?",
    category: "Art & Creativity",
    likes: 19,
    likedByMe: false,
    comments: [
      {
        id: "c14",
        authorId: "u4",
        authorName: "Artsy Anna",
        authorHandle: "artsy_anna",
        content:
          "Welcome to the digital art world! Procreate is the best. Try the 'Quick Shape' feature!",
        createdAt: daysAgo(4),
      },
      {
        id: "c15",
        authorId: "u1",
        authorName: "Alex B.",
        authorHandle: "alex_b",
        content:
          "The undo button is basically a digital artist's best friend lol",
        createdAt: daysAgo(4),
      },
    ],
    createdAt: daysAgo(5),
  },
  {
    id: "p8",
    authorId: "u5",
    authorName: "Sports Sam",
    authorHandle: "sports_sam",
    content:
      "Anyone else feel like school lunches have gotten way better this year? They introduced a salad bar and now I actually enjoy lunch break. Small things really do make a big difference to your day. What's something small that made your school day better recently?",
    category: "General",
    likes: 33,
    likedByMe: false,
    comments: [
      {
        id: "c16",
        authorId: "u6",
        authorName: "Bookworm Bee",
        authorHandle: "bookworm_bee",
        content:
          "Our library got new bean bags and it honestly changed everything for reading time!",
        createdAt: daysAgo(5),
      },
      {
        id: "c17",
        authorId: "u2",
        authorName: "Mia J.",
        authorHandle: "mia_j",
        content:
          "Our art teacher started playing lo-fi music during class and it's so calming ✨",
        createdAt: daysAgo(5),
      },
    ],
    createdAt: daysAgo(6),
  },
];
