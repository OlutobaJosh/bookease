# BookEase — Alex Carter Fitness Booking App

A modern fitness session booking platform built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## Features

- **Public homepage** — Hero, services from Supabase, about section, CTA
- **Booking page** — Service selector, date picker (Sundays blocked), time slot grid with live availability, client form
- **Admin dashboard** — Protected route with booking table, status management, stats
- **Admin auth** — Cookie-based session with HMAC-signed token (no third-party auth required)

---

## Prerequisites

- Node.js 18+
- A Supabase project with these tables:

```sql
-- services
create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes integer not null,
  price numeric not null
);

-- bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text,
  service_id uuid references services(id),
  booking_date date not null,
  booking_time time not null,
  message text,
  status text not null default 'pending',
  created_at timestamptz default now()
);
```

Enable Row Level Security and add policies:
```sql
-- Allow public to read services
alter table services enable row level security;
create policy "Public read services" on services for select using (true);

-- Allow public to insert bookings, read own via anon key
alter table bookings enable row level security;
create policy "Public insert bookings" on bookings for insert with check (true);
create policy "Public read bookings by date" on bookings for select using (true);
create policy "Public update bookings status" on bookings for update using (true);
```

---

## Local Development

```bash
# 1. Clone and install
npm install

# 2. Create your env file
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and admin credentials

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Render

### Option A — via render.yaml (recommended)
1. Push this repo to GitHub
2. In Render, click **New → Blueprint**
3. Connect your repo — Render reads `render.yaml` automatically
4. Add the env vars in the Render dashboard (marked `sync: false`)

### Option B — manual
1. New → Web Service → connect your GitHub repo
2. **Build Command:** `npm install && npm run build`
3. **Start Command:** `npm start`
4. **Node version:** 18+
5. Add all env vars from `.env.example`

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `ADMIN_EMAIL` | Email for admin login |
| `ADMIN_PASSWORD` | Password for admin login |
| `ADMIN_SECRET` | Random secret for signing session cookie (use `openssl rand -hex 32`) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Public homepage |
| `/book` | Booking form |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin bookings dashboard (protected) |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Auth:** Cookie-based, HMAC-SHA256 signed token
- **Deployment:** Render
