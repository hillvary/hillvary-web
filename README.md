# Hillvary

A Christian clothing ministry storefront — Next.js (App Router) + TypeScript + Tailwind CSS on
the frontend, Prisma + PostgreSQL on the backend, with a full admin CMS for managing products,
categories, inventory, and orders.

## Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Zustand
- **Backend:** Next.js Route Handlers (REST API), Prisma ORM, PostgreSQL
- **Auth:** JWT (httpOnly cookie) for the admin dashboard only — no customer accounts
- **Images:** Cloudinary
- **Deployment target:** Vercel (frontend + API routes) + any managed Postgres (Neon, Supabase, etc.)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | Everything | Postgres connection string |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Admin image uploads | From your Cloudinary dashboard |
| `JWT_SECRET` | Admin auth | Long random string |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Seeding | Credentials for the first admin user, created by `prisma db seed` |
| `NEXT_PUBLIC_SITE_URL` | SEO (sitemap, OG tags) | e.g. `https://hillvary.com` |

#### Database

Recommended: provision Postgres through the **Vercel Marketplace** (Neon is preferred):

```bash
npm i -g vercel   # if not already installed
vercel login
vercel link
vercel integration add neon
vercel env pull .env.local
```

Any standard Postgres connection string works (Neon, Supabase, Render, local Postgres) — the
app doesn't depend on a specific provider.

For quick local development without any external account, Prisma can run a local Postgres
server for you:

```bash
npx prisma dev --detach   # prints a local connection string
# paste it into DATABASE_URL in .env
```

#### Cloudinary

Create a free account at [cloudinary.com](https://cloudinary.com), then copy the Cloud Name,
API Key, and API Secret from the dashboard into `.env`. Without these set, the admin image
uploader will return an error but the rest of the app works fine.

### 3. Set up the database

```bash
npx prisma db push      # create tables from prisma/schema.prisma
npx prisma db seed      # seed categories, sizes, colors, sample products, and the admin user
```

The seed script prints the admin login it created (defaults to
`admin@hillvary.com` / whatever `ADMIN_SEED_PASSWORD` is set to).

### 4. Run the dev server

```bash
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project structure

```
prisma/
  schema.prisma        # Users, Products, Categories, Sizes, Colors, Orders, Settings, etc.
  seed.ts               # sample data + admin user
src/
  app/
    (storefront)/       # Home, Shop, Product detail, About, Contact, Checkout — public site
    admin/
      login/            # admin sign-in (public)
      (protected)/       # dashboard, products, categories, inventory, orders, settings
    api/                # REST route handlers (public + admin-guarded)
    sitemap.ts, robots.ts
  components/           # layout/, home/, shop/, product/, admin/, contact/
  lib/
    data/               # server-side Prisma query helpers
    store/              # Zustand stores: cart, wishlist, recently-viewed
    prisma.ts, auth.ts, cloudinary.ts, require-admin.ts
  proxy.ts              # Next.js Proxy (formerly "middleware") — optimistic admin route guard
```

Real authorization for `/admin/*` and all admin API routes happens via `requireAdmin()`
(JWT verification), not the proxy — the proxy only redirects unauthenticated visitors early.

## Fonts

The design calls for **Helvetica Now Display** and **Moldin Demo**, both commercial fonts that
can't be bundled automatically. See `public/fonts/README.md` — drop the licensed `.woff2` files
in and they're picked up via `@font-face` in `globals.css`. Until then, the site falls back to
free Google Fonts (Archivo / Archivo Black) so the build never breaks.

## Product images

Home page hero, gallery, and seed data currently use `placehold.co` placeholder images so the
site is fully browsable out of the box. Replace them with real product photography via the
admin dashboard's drag-and-drop uploader (Products → New/Edit → Images), which uploads directly
to Cloudinary.

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # run a production build
npm run lint       # ESLint
npx prisma studio  # browse/edit the database visually
```

## Deployment

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables from `.env` in the Vercel project settings (or run
   `vercel env add` for each), pointing `DATABASE_URL` at your production Postgres instance.
4. Run migrations against production once: `npx prisma db push` (or switch to
   `prisma migrate deploy` if you adopt versioned migrations) with production `DATABASE_URL`.
5. Deploy.

## What's intentionally out of scope

- **Payments:** Checkout collects customer + shipping info and creates a real `Order` +
  `OrderItem` record (stock is decremented), but no payment gateway is wired up — orders are
  fulfilled manually (COD / bank transfer / mobile money) until a processor is added.
- **Customer accounts:** There's no customer login — only the admin dashboard is
  authenticated. Cart and wishlist persist in the browser (localStorage) per device.
