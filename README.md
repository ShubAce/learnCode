# LearnCode

**Master problem solving, one line at a time.**

LearnCode is a modern coding-practice platform. Solve curated algorithm problems in JavaScript, Python, Java and C++ inside an IDE-grade workspace, get real verdicts from a sandboxed judge, track your progress, and learn with an AI tutor that reads your code.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Prisma 7 + PostgreSQL, Clerk and the Vercel AI SDK.

---

## Features

**Solving**

- IDE-style workspace — resizable panes, Monaco editor with custom themes, a test case console, and a mobile layout with tabs
- A real judge with precise verdicts: Accepted, Wrong Answer, Compilation Error, Runtime Error and Time Limit Exceeded
- Pluggable code execution with automatic fallback: **Wandbox** (free, no API key), **Judge0** (RapidAPI or self-hosted) and **Piston** (self-hosted)
- Drafts saved per problem and per language, keyboard shortcuts (`Ctrl/⌘ + '` to run, `Ctrl/⌘ + Enter` to submit), and confetti on accepted solutions
- Spoiler-guarded editorials, progressive hints, and a submission history with "load into editor"

**Learning**

- AI tutor (Gemini via the AI SDK) that streams answers, knows the problem and sees your current code
- Profile with an activity heatmap, streaks, acceptance rate, a difficulty breakdown and language stats
- Playlists to group problems, with progress tracking

**Platform**

- Animated marketing pages with live statistics from the database
- Problem explorer with search (`/` to focus), difficulty, tag and status filters, sorting and "pick one for me"
- Admin authoring with one shared form for create and edit: section navigation, Markdown preview, per-language code tabs and a sample library
- Light and dark themes with a circular reveal transition, and support for reduced motion

## Architecture

```
app/                     Routes (App Router)
  (root)/                Pages with the site header and footer: landing, problems, profile, about, admin authoring
  (auth)/                Sign-in and sign-up (Clerk) in a split-screen layout
  problem/[id]/          The solving workspace (full-screen)
  api/                   AI tutor stream, REST endpoints for playlists and problems
config/                  Single source of truth: site, languages, difficulty, topics, verdicts, stack
lib/
  execution/             Code execution engine
    providers/           wandbox.ts · judge0.ts · piston.ts — one adapter per backend
    index.ts             Provider chain, fallback and result cache
    judge.ts             Runs test cases and grades the output
  db.ts                  Prisma client (server only)
components/
  ui/                    shadcn/ui primitives
  motion/                Reveal, stagger, animated numbers, marquee, spotlight card
  shared/                Badges, Markdown, progress ring, segmented control, empty states
  layout/                Site header, footer, backdrop
modules/                 Feature modules — each has data (server queries), actions (server actions) and components
  problems/  playlists/  profile/  home/  ai/  auth/
prisma/                  Schema and migrations
```

Key design decisions:

- **No hard-coded content.** Languages, difficulties, topics, navigation and verdict styling live in `config/`, and marketing numbers come from the database.
- **Secure by default.** Test cases and expected outputs are always loaded on the server. Reference solutions never reach the browser. Every server action checks authentication and authorisation itself.
- **Design tokens.** Colours are defined once in `app/globals.css` (OKLCH, light and dark) and used as Tailwind utilities such as `text-easy` and `bg-primary/10`.

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local via Docker, or hosted such as Neon)
- A [Clerk](https://clerk.com) application
- Optional: a [Google AI Studio](https://aistudio.google.com/apikey) key for the AI tutor

### Setup

```bash
git clone https://github.com/ShubAce/learnCode.git
cd learnCode
npm install

cp .env.example .env        # then fill in your keys
docker compose up -d        # optional: local PostgreSQL
npx prisma migrate deploy   # apply database migrations
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To make yourself an admin (to create problems), set your user's `role` to `ADMIN` in the `User` table, for example with `npx prisma studio`.

## Code execution

The judge talks to whichever providers you list in `CODE_EXECUTION_PROVIDERS`, in order. If one fails (outage, invalid key, quota), the next one is tried.

| Provider  | Setup                                                   | Notes                                                                                  |
| --------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `wandbox` | None                                                    | Default. Free and key-less, but the public instance is rate-limited per IP.             |
| `judge0`  | `JUDGE0_API_URL`, `JUDGE0_API_KEY` (+ `RAPIDAPI_HOST`)  | RapidAPI-hosted or self-hosted. Reports runtime and memory.                             |
| `piston`  | `PISTON_API_URL`                                        | Self-host with Docker: `npm run piston:up`, then `npm run piston:setup`.                |

```env
# Prefer Judge0, fall back to Wandbox
CODE_EXECUTION_PROVIDERS=judge0,wandbox
```

Identical runs (same language, code and input) are cached for 10 minutes, so running and then submitting unchanged code costs no extra provider calls.

To support another language, add it to `config/languages.ts` and map it in each provider adapter. TypeScript flags any adapter you miss.

## Scripts

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start the dev server                      |
| `npm run build`         | Production build                          |
| `npm run start`         | Serve the production build                |
| `npm run lint`          | ESLint (Next.js + React Compiler rules)   |
| `npm run typecheck`     | TypeScript type check                     |
| `npm run db:generate`   | Regenerate the Prisma client              |
| `npm run piston:up`     | Start a self-hosted Piston container      |
| `npm run piston:setup`  | Install language runtimes into Piston     |

## Environment variables

See [`.env.example`](.env.example) for the full, commented list.

| Variable                                                    | Required | Purpose                                                    |
| ----------------------------------------------------------- | -------- | ---------------------------------------------------------- |
| `DATABASE_URL`                                              | Yes      | PostgreSQL connection string                               |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`     | Yes      | Authentication                                             |
| `CODE_EXECUTION_PROVIDERS`                                  | No       | Provider order (default `wandbox`)                          |
| `GOOGLE_GENERATIVE_AI_API_KEY`                              | No       | Enables the AI tutor                                       |
| `AI_MODEL`                                                  | No       | Gemini model id (default `gemini-2.5-flash`)                |
| `NEXT_PUBLIC_APP_URL`                                       | No       | Public URL for metadata                                    |

## License

MIT — contributions welcome.
