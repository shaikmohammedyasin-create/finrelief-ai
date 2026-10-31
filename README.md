# FinRelief AI - AI-Powered Debt Relief & Financial Recovery Platform

> **Build status:** Phases 1-8 complete (Folder Structure, Backend, Database, Authentication,
> Frontend, Dashboard & UI, AI Integration, Financial Engine & Settlement APIs).

## 🌐 Live Deployment

- **Live App (Vercel):** https://frontend-chi-ivory-51.vercel.app
- **API Backend (Render):** https://frontend-chi-ivory-51.vercel.app (add `:8000` if deployed)

**Demo login:** `demo@finrelief.ai` / `Demo1234`

## What's implemented so far

### Backend

- **Auth**: JWT access + refresh tokens, bcrypt hashing, refresh-token rotation with real
  server-side revocation (logout actually invalidates a token, not just deletes it client-side).
- **Database**: SQLAlchemy models for `User`, `Loan`, `FinancialProfile`, `SettlementRecord`,
  `AIHistory`, `RevokedToken`. SQLite by default, PostgreSQL-ready via `DATABASE_URL`.
- **Financial Engine** (`app/services/financial_engine.py`): pure, unit-testable functions for
  EMI ratio, debt-to-income ratio, monthly surplus, debt stress score (+ Low/Medium/High
  classification), financial health score, per-loan priority index, loan ranking, settlement
  percentage recommendation, and a month-by-month debt repayment simulation.
- **APIs**: full CRUD for loans (search, filter, sort, pagination, CSV export), financial
  analysis, settlement recommendations, negotiation letter generation, AI history
  (search/paginate/delete), dashboard aggregation, and user profile.
- **AI Negotiation Engine**: Google Gemini integration that automatically falls back to a
  deterministic, template-based letter generator if Gemini is unconfigured, errors, times out,
  or returns an empty response - the frontend always gets a complete letter either way, and is
  told which path generated it.

### Frontend

- **Stack**: React 18 + Vite + React Router + Axios + Tailwind CSS + React Hook Form + Chart.js
  (via react-chartjs-2) + react-icons.
- **Design system**: dark, glassmorphic fintech theme - deep navy background, emerald/indigo
  gradient accents, `Sora` display type, `Inter` body type, and `IBM Plex Mono` for all money
  figures (tabular numerals), defined as reusable Tailwind tokens and utility classes in
  `src/styles/index.css`.
- **Auth**: `AuthContext` hydrates the session on load, Axios interceptors attach the access
  token and transparently refresh + retry on 401 (with request queuing so concurrent requests
  don't trigger duplicate refreshes).
- **Pages**: Landing, About, Features, Pricing, Login, Register, Dashboard, Loan Management,
  Financial Profile, Settlement Prediction, Negotiation Letter Generator, AI History, Know Your
  Rights, Settings, Profile, and a 404.
- **Dashboard charts**: pie (loan distribution), bar (expense breakdown), line (12-month debt
  projection), progress bar (settlement progress), and a heatmap (loan priority).
- **Reusable components**: Navbar, Sidebar, Modal, Pagination, SearchBar, Loader/Skeletons,
  Toast notifications, LoanTable/LoanForm, FinancialForm, NegotiationGenerator, HistoryTable,
  StressMeter, ProtectedRoute.

## Running it locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # set SECRET_KEY and GEMINI_API_KEY
uvicorn app.main:app --reload
```

API: `http://localhost:8000` - Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env            # defaults to http://localhost:8000/api
npm run dev
```

App: `http://localhost:5173`

## API reference (implemented so far)

| Method | Path                     | Description                                  |
|--------|---------------------------|-----------------------------------------------|
| POST   | `/api/auth/register`      | Create an account                             |
| POST   | `/api/auth/login`         | Authenticate                                  |
| POST   | `/api/auth/refresh`       | Rotate refresh token                          |
| POST   | `/api/auth/logout`        | Revoke a refresh token                        |
| GET    | `/api/auth/me`            | Current user (protected)                      |
| GET/PUT| `/api/profile`            | View/update profile                           |
| POST   | `/api/loan`                | Create a loan                                 |
| GET    | `/api/loans`               | List loans (search/filter/sort/paginate)      |
| GET    | `/api/loans/export`        | Export loans to CSV                           |
| GET/PUT/DELETE | `/api/loan/{id}`    | Get/update/delete a loan                      |
| POST   | `/api/financial-analysis` | Run the financial engine, persist profile     |
| POST   | `/api/settlement`         | Generate settlement recommendations           |
| POST   | `/api/generate-letter`    | Generate a negotiation letter (Gemini/fallback)|
| GET/DELETE | `/api/history` / `/api/history/{id}` | AI history list & delete          |
| GET    | `/api/dashboard`          | Full dashboard aggregation                    |

## Notes on verification

This environment has no outbound network access, so dependencies could not be `pip install`ed
or `npm install`ed to run the apps live. Every Python file was verified with `py_compile`, and
every JS/JSX file was verified with a real Babel JSX parser (via Playwright's bundled Babel) -
both catch syntax errors, but neither replaces actually running `uvicorn` and `npm run dev`
locally. Please run both before deploying.

## Coming next (Phase 9-10)

- Dockerfile, docker-compose.yml, Render + Vercel deployment configs, production env handling.
- Final consolidated README with screenshots placeholders and full setup/deployment walkthrough.

## Tech stack

**Backend:** Python 3.11, FastAPI, SQLAlchemy, Pydantic v2, JWT (python-jose), bcrypt (passlib), Google Gemini
**Database:** SQLite (dev) / PostgreSQL (production-ready via `DATABASE_URL`)
**Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, React Hook Form, Chart.js, react-icons
