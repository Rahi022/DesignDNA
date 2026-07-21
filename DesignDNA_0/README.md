# DesignDNA

AI-powered logo generation and design analysis platform.

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Backend:** FastAPI + SQLite
- **AI:** Google Gemini (`gemini-2.5-flash-image`) for logo generation, with an
  automatic local fallback image if the AI call fails or no key is set.

---

## 1. Prerequisites

- **Node.js 20+** — check with `node -v`
- **Python 3.12+** — check with `python --version`
- A **Gemini API key** — already configured for you in `backend/.env`
  (get your own free key any time at https://aistudio.google.com/apikey)

---

## 2. Backend setup (FastAPI)

Open a terminal in the project root:

```bash
cd backend

# create a virtual environment
python -m venv venv

# activate it
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# install dependencies
pip install -r requirements.txt

# run the server
uvicorn main:app --reload
```

The API is now running at **http://localhost:8000**.
Check it's alive at http://localhost:8000/docs (interactive Swagger UI).

The database (`designdna.db`) and `uploads/` folders are created automatically
on first run — no manual setup needed.

---

## 3. Frontend setup (Next.js)

Open a **second terminal**, in the project root (keep the backend running):

```bash
npm install
npm run dev
```

The app is now running at **http://localhost:3000**.

> `.env.local` is already included and points the frontend at
> `http://localhost:8000`. Keep using `localhost` (not `127.0.0.1`) for both —
> mixing the two breaks the login cookie (browsers treat them as different sites).

---

## 4. Create your account

1. Go to http://localhost:3000/register and sign up.
2. You'll land on `/login` — sign in with the same email/password.
3. You're now on the dashboard.

Every new account registers as a normal `user`. To make yourself an admin
(and unlock `/admin`), run this once from the `backend/` folder (venv active):

```bash
python make_admin.py you@example.com
```

Log out and back in afterward for the admin role to take effect.

---

## 5. What's included

| Feature | Route | Notes |
|---|---|---|
| Landing page | `/` | |
| Register / Login | `/register`, `/login` | Cookie-based auth (httpOnly) |
| Dashboard | `/dashboard` | Stats overview |
| Design Analysis | `/upload` | Upload an image, get a scored breakdown |
| AI Logo Generator | `/generate-logo` | Real Gemini image generation, with automatic offline fallback |
| Logo History | `/logo-history` | View, favorite, download, delete |
| Analysis History | `/history` | |
| Analytics | `/analytics` | Charts over your own activity |
| Profile | `/profile` | Avatar, name, recent activity |
| Settings | `/settings` | Change password, delete account |
| Admin Dashboard | `/admin` | Platform-wide stats (admin only) |
| Admin: Users | `/admin/users` | Promote/demote, enable/disable, delete |
| Admin: Logos / Designs | `/admin/logos`, `/admin/designs` | Everyone's generations |
| Admin: Prompt Analytics | `/admin/prompts` | Most-used prompts/styles |
| Admin: Settings | `/admin/settings` | |

Route protection is enforced twice: server-side in `proxy.ts` (redirects before
the page even renders) and client-side in `app/guards/` (handles the loading
state and role checks once you're in).

---

## 6. Troubleshooting

**"Failed to fetch" on register/login**
The backend isn't running, or you're running `uvicorn` from the wrong folder.
It must be run from inside `backend/`, not the project root.

**Register succeeds but you're bounced back to login**
Your `NEXT_PUBLIC_API_URL` doesn't match the host you're opening the site
with. Both must be `localhost`, not a mix of `localhost` and `127.0.0.1`.
Restart `npm run dev` after changing `.env.local` — Next.js only reads it at
startup.

**Registration fails with a 500 error about bcrypt / "72 bytes"**
Your installed `bcrypt` is newer than what's pinned in `requirements.txt`.
Run: `pip install "bcrypt==4.0.1" --force-reinstall`

**Logo generation always falls back to the placeholder image**
Check `backend/.env` has a valid `GEMINI_API_KEY` and that the backend
terminal doesn't show a Gemini error on generate — it will still return a
locally-drawn placeholder logo instead of failing outright, by design.

---

## 7. Security note

`backend/.env` contains your real Gemini API key. It's already excluded from
version control via `.gitignore` — never commit it or paste it anywhere public.
If it's ever exposed, rotate it at https://aistudio.google.com/apikey.
