# 🚀 LearnCode - LeetCode Clone

A full-featured competitive programming platform built with Next.js 16, featuring real-time code execution, AI-powered assistance, and comprehensive problem management.

## ✨ Features

### Core Functionality

- 🔐 **Authentication & Authorization** - Secure user authentication with Clerk
- 💻 **Code Editor** - Monaco Editor with syntax highlighting for multiple languages (Python, JavaScript, Java, C++)
- ⚡ **Real-time Code Execution** - Execute and test code using Judge0 API
- 🤖 **AI-Powered Coding Assistant** - Get hints and help with Google's Generative AI
- 📝 **Problem Management** - CRUD operations for coding problems with examples, constraints, and test cases
- 📊 **Submission Tracking** - Track all code submissions with detailed results
- 🎯 **Problem Solving Progress** - Track solved problems and view submission history
- 📚 **Playlist System** - Organize problems into custom playlists
- 🎨 **Dark/Light Theme** - Toggle between themes with next-themes
- 👤 **User Profiles** - View user statistics and solved problems

### Problem Features

- Multiple difficulty levels (Easy, Medium, Hard)
- Tag-based categorization
- Examples with input/output
- Constraints and hints
- Editorial solutions
- Test case validation
- Reference solutions

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI, Shadcn/ui
- **Code Editor:** Monaco Editor
- **Forms:** React Hook Form + Zod validation
- **Theme:** next-themes

### Backend

- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Authentication:** Clerk
- **AI Integration:** Google Generative AI (Gemini)
- **Code Execution:** Judge0 API

### DevOps

- **Containerization:** Docker & Docker Compose
- **Type Safety:** TypeScript 5

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.x or higher
- Docker and Docker Compose
- npm, yarn, pnpm, or bun package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd leetcode_clone
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/learnCode"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Judge0 API (RapidAPI)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com

# Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

#### How to get API Keys:

1. **Clerk**: Sign up at [clerk.com](https://clerk.com) and create a new application
2. **Judge0**: Subscribe at [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
3. **Google AI**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Database Setup

Start the PostgreSQL database using Docker:

```bash
docker compose up -d
```

This will start a PostgreSQL container on port 5432.

### 5. Run Prisma Migrations

Generate Prisma Client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. (Optional) Seed the Database

If you have seed data, run:

```bash
npx prisma db seed
```

### 7. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will automatically start Docker Compose and then the Next.js dev server.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
leetcode_clone/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes (sign-in, sign-up)
│   ├── (root)/            # Main application routes
│   │   ├── page.tsx       # Home page
│   │   ├── about/         # About page
│   │   ├── problems/      # Problems list
│   │   └── profile/       # User profile
│   ├── api/               # API routes
│   │   ├── ai-chat/       # AI assistant endpoint
│   │   ├── create-problem/
│   │   └── playlists/
│   ├── create-problem/    # Problem creation page
│   ├── edit-problem/      # Problem editing page
│   └── problem/[id]/      # Individual problem page
├── components/            # Reusable React components
│   ├── ui/               # UI component library (Shadcn)
│   └── providers/        # Context providers
├── modules/              # Feature modules
│   ├── auth/             # Authentication logic
│   ├── home/             # Home page components
│   ├── problems/         # Problem-related components & actions
│   └── profile/          # Profile components & actions
├── lib/                  # Utility libraries
│   ├── db.ts            # Prisma client
│   ├── judge0.ts        # Judge0 API integration
│   └── utils.ts         # Helper functions
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   └── migrations/      # Database migrations
├── public/              # Static assets
└── hooks/               # Custom React hooks
```

## 🎯 Key Features Explained

### Code Execution

The platform uses Judge0 API to execute code in multiple programming languages:

- Supports Python, JavaScript, Java, and C++
- Batch submission for running multiple test cases
- Real-time status polling
- Detailed execution results (stdout, stderr, time, memory)

### AI Assistant

Integrated AI chat helps users:

- Get hints without giving away the solution
- Understand problem requirements
- Debug their code
- Learn optimal approaches

### Problem Management

Admins can create problems with:

- Rich text descriptions
- Multiple examples
- Custom test cases
- Code snippets for each language
- Reference solutions
- Editorial content

### Playlist System

Users can organize problems into themed collections:

- Create custom playlists
- Add/remove problems
- Track progress within playlists

## 🔧 Available Scripts

```bash
npm run dev      # Start development server with Docker
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🗄️ Database Schema

Key models:

- **User** - User accounts with role-based access
- **Problem** - Coding problems with metadata
- **Submission** - Code submissions with results
- **TestCaseResult** - Individual test case outcomes
- **ProblemSolved** - Tracks solved problems per user
- **Playlist** - Problem collections
- **ProblemInPlaylist** - Many-to-many relation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Code execution powered by [Judge0](https://judge0.com/)
- Authentication by [Clerk](https://clerk.com)
- AI features by [Google Gemini](https://deepmind.google/technologies/gemini/)

---

Made with ❤️ for competitive programming enthusiasts
