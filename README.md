# Diocèse de Kabgayi — Official Website

Full-stack website for the **Catholic Diocese of Kabgayi** (Rwanda). It combines a
multilingual public site, a JWT-protected admin CMS, and a REST API backed by MySQL.

- **Live domain:** `diocesekabgayi.rw`
- **Languages:** French (default), English, Kinyarwanda

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, React Router 7, `lucide-react`, `react-quill-new` |
| Admin CMS | React 19 (mounted inside the main app at `/admin`) |
| Backend | Node.js, Express 4 |
| Database | MySQL (`mysql2`, promise pool) |
| Auth | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` |
| Uploads | `multer` (served statically from `/uploads`) |
| Email | `nodemailer` (SMTP) |

---

## Monorepo Layout

```
Kabgayi/
├── src/                 # Public site + Admin CMS (single Vite app)
│   ├── pages/           # Public pages (Home, Paroisses, Actualités, ...)
│   ├── components/      # Navbar, Footer, HeroSlider, NewsSection, ...
│   ├── context/         # LanguageContext (FR / EN / RW)
│   ├── i18n/            # translations.js
│   ├── hooks/           # useApi.js
│   ├── admin/           # Admin CMS
│   │   ├── pages/       # Dashboard, News, Parishes, Bishop, Users, ...
│   │   ├── context/     # AdminAuthContext, AdminLangContext
│   │   └── AdminApp.jsx # Admin router (mounted at /admin/*)
│   ├── App.jsx          # Root router + MAINTENANCE_MODE flag
│   └── config.js        # API_URL from VITE_API_URL
│
├── backend/             # Express REST API
│   ├── server.js        # App entry, CORS, route mounting
│   ├── routes/          # authRoutes, newsRoutes, parishRoutes, ...
│   ├── middleware/      # auth.js (JWT verification)
│   ├── db/              # connection.js, setup.js, migrations, seeds
│   ├── uploads/         # Uploaded media (served at /uploads)
│   └── .env             # Backend environment variables (not committed)
│
├── admin/               # Legacy standalone admin (separate Vite app, port 3001)
├── public/              # Static assets (favicon, icons)
├── docs/                # Source documents (parishes, history, ...)
└── dist.zip             # Production build artifact
```

### Key files
- [`src/App.jsx`](src/App.jsx) — public + admin routing and the `MAINTENANCE_MODE` toggle.
- [`src/admin/AdminApp.jsx`](src/admin/AdminApp.jsx) — admin routes guarded by JWT auth.
- [`backend/server.js`](backend/server.js) — Express setup, CORS allow-list, API route mounting.
- [`backend/db/setup.js`](backend/db/setup.js) — creates the database, tables, and seed data.

---

## Features

- **Public site** — Home, À Propos, Services, Éducation, Pastorale, Paroisses,
  Vie Consacrée, Actualités, Documentation, Liturgie, and Contact.
- **Parishes** — listing and per-parish detail pages (`/paroisses/:id`).
- **News** — listing and detail pages (`/actualites/:id`) managed through the CMS.
- **Services & Pastoral** — dynamic sections with slug-based detail pages.
- **Multilingual** — French, English, and Kinyarwanda; content tables store
  `_fr` / `_en` / `_rw` variants. See [`src/i18n/translations.js`](src/i18n/translations.js).
- **Admin CMS** — manage Hero slides, News, Parishes, Services, Pastoral, the
  Bishop's page, Agenda, Messages, Settings, and Users behind JWT authentication.
- **Contact form** — messages stored in `contact_messages` and emailed via Nodemailer.

> **Note:** `MAINTENANCE_MODE` in [`src/App.jsx`](src/App.jsx) is currently `true`,
> which limits the public routes served. Set it to `false` to expose the full site.

---

## Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **MySQL** 8 running locally (or a reachable MySQL server)

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables)), then
create the database, tables, and seed data:

```bash
npm run setup
```

Start the API server:

```bash
npm run dev      # nodemon (auto-reload) — http://localhost:5000
# or
npm start        # node server.js
```

Health check: `GET http://localhost:5000/api/health`.

### 2. Frontend + Admin CMS

The public site and admin are a single Vite app. From the repository root:

```bash
npm install
npm run dev      # http://localhost:5173
```

- Public site → `http://localhost:5173/`
- Admin CMS → `http://localhost:5173/admin`

Vite proxies `/api` requests to `http://localhost:5000` (see
[`vite.config.js`](vite.config.js)), so the backend must be running.

Other scripts:

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # eslint
```

### 3. Legacy admin (`/admin`, optional)

A separate standalone Vite app kept for reference:

```bash
cd admin
npm install
npm run dev      # http://localhost:3001
```

### Default admin credentials

`npm run setup` seeds a super-admin (defined in [`backend/db/setup.js`](backend/db/setup.js)):

| Field | Value |
|-------|-------|
| Email | `admin@diocesedekabgayi.org` |
| Password | `Admin@Kabgayi2024` |
| Role | `superadmin` |

> ⚠️ Change these credentials immediately after setup in any real environment.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | *(your password)* |
| `DB_NAME` | Database name | `kabgayi` |
| `JWT_SECRET` | Secret for signing tokens | *(long random string)* |
| `JWT_EXPIRES` | Token lifetime | `7d` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NOTIFY_EMAIL` | Recipient for contact-form notifications | `you@example.org` |
| `SMTP_HOST` | SMTP server | `mail.diocesekabgayi.rw` |
| `SMTP_PORT` | SMTP port | `465` |
| `SMTP_SECURE` | Use TLS | `true` |
| `SMTP_USER` | SMTP username | `noreply@diocesekabgayi.rw` |
| `SMTP_PASS` | SMTP password | *(your password)* |

CORS also allows the production origins hard-coded in
[`backend/server.js`](backend/server.js) (`diocesekabgayi.rw`, `backendi.smartdealerltd.com`,
and the local dev ports).

### Frontend (`.env.development` / `.env.production`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base API URL consumed by [`src/config.js`](src/config.js). Defaults to `http://localhost:5000/api` in development; `https://backendi.smartdealerltd.com/api` in production. |

---

## API Routes

Mounted in [`backend/server.js`](backend/server.js):

| Endpoint | Purpose |
|----------|---------|
| `/api/auth` | Login / token issuance |
| `/api/users` | Admin user management |
| `/api/hero` | Homepage hero slides |
| `/api/news` | News articles |
| `/api/parishes` | Parishes |
| `/api/services` | Diocesan services |
| `/api/pastoral` | Pastoral programs |
| `/api/bishop` | Bishop's page content |
| `/api/agenda` | Events / agenda |
| `/api/settings` | Site settings (name, contacts, socials) |
| `/api/contact` | Contact-form submissions |
| `/api/upload` | Media uploads (Multer) |
| `/api/health` | Health check |

---

## Database

[`backend/db/setup.js`](backend/db/setup.js) creates the `kabgayi` database and the
core tables: `admin_users`, `hero_slides`, `news`, `parishes`, `services`,
`documents`, `settings`, and `contact_messages`. It also seeds default settings and
three hero slides.

Additional helpers live in `backend/db/`:
- `connection.js` — shared MySQL pool
- `migrate.js`, `migrate-pastoral.js` — schema migrations
- `seed-pastoral.js` — pastoral seed data
- `reset-admin.js` — reset the admin user

---

## Deployment

1. Build the frontend: `npm run build` (outputs to `dist/`). Set
   `VITE_API_URL` for the target environment before building.
2. Deploy the backend with `npm start`, configuring `backend/.env` (or
   `.env.production`) with production database, JWT, and SMTP values.
3. Serve `dist/` behind a static host and route `/api` to the Express server.
4. Ensure uploaded media (`backend/uploads`) is persisted.
