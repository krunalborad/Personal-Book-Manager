# Ledger — Personal Book Manager

A quiet, personal shelf for the books you're reading, have read, and mean to
get to. Built with Next.js (App Router), MongoDB, and JWT auth.

Books render as spines on a shelf — click one to open it. Status is shown as
a rotated library stamp instead of a generic colored badge.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers (API routes) — no separate Express
  server needed, so the whole app deploys as one Vercel project
- **Database:** MongoDB with Mongoose
- **Auth:** JWT stored in an `httpOnly` cookie (not `localStorage`, so it
  can't be read or stolen by client-side JS/XSS)

## Project structure

```
src/
  app/
    api/
      auth/{signup,login,logout,me}/route.ts   # auth endpoints
      books/route.ts                            # list (with filters) + create
      books/[id]/route.ts                        # update + delete a single book
    dashboard/page.tsx                           # server component, resolves the user
    login/, signup/                              # auth pages
    layout.tsx, globals.css                      # fonts, design tokens
  components/                                    # UI: BookShelf, BookSpine,
                                                   # BookFormModal, FilterBar, etc.
  lib/
    db.ts            # cached Mongoose connection (safe for serverless)
    auth.ts           # JWT sign/verify
    constants.ts       # cookie name (kept dependency-free for Edge middleware)
    models/{User,Book}.ts
  middleware.ts       # redirects unauthenticated users away from /dashboard
```

## Local setup

**1. Install dependencies**

```bash
npm install
```

**2. Set up MongoDB Atlas**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user (Database Access) and note the username/password
3. Allow your IP (Network Access) — for local dev, "Allow access from anywhere" (`0.0.0.0/0`) is simplest
4. Click **Connect → Drivers**, copy the connection string

**3. Configure environment variables**

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/book-manager?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
```

Generate a strong `JWT_SECRET` with:

```bash
openssl rand -base64 32
```

**4. Run the dev server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Design decisions worth knowing about

- **Auth is scoped server-side, not just hidden client-side.** Every book
  query/update/delete filters by `{ user: <current user id> }` in the
  database query itself — so even a guessed book `_id` can't be edited or
  read by another account.
- **Middleware only checks cookie presence, not signature.** Edge Runtime
  can't run the same JWT verification Node can, so middleware is a fast UX
  redirect; the real security boundary is the `verifyToken()` check inside
  every API route.
- **Passwords are hashed with bcrypt** and the field is `select: false` on
  the schema, so it's never accidentally returned from a query.
- **Book heights on the shelf are deterministic**, derived from each book's
  `_id`, so the shelf doesn't visually jitter between renders.
- **Two views of the same data.** The shelf view is the visual centerpiece;
  the list view is a plain table for anyone who wants to scan everything at
  once. Both read from the same filtered book list, so they're always in
  sync.
- **Status can be changed two ways:** click a book to open the full edit
  form, or click its stamp/emoji directly to cycle it forward
  (want to read → reading → completed → want to read) without opening
  anything. The cycle is optimistic — the UI updates immediately and rolls
  back only if the request fails.

## Deploying

1. Push this repo to GitHub
2. Import it into [Vercel](https://vercel.com/new)
3. Add the same three environment variables (`MONGODB_URI`, `JWT_SECRET`,
   `JWT_EXPIRES_IN`) in the Vercel project settings
4. In Atlas, make sure Network Access allows Vercel's traffic (either
   `0.0.0.0/0` or Atlas's Vercel integration)
5. Deploy

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

## Live Deployment

https://personal-book-manager-taupe.vercel.app/
