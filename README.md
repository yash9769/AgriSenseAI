# AgriSense AI — Living Laboratory
### AI-Powered Crop Diagnostics Platform

---

## 🚀 Quick Start

1. **Open `index.html`** in any modern browser — no build step needed.
2. **Run the SQL** in `supabase_schema.sql` in your Supabase SQL Editor to set up tables.
3. **Use Demo Login** on the sign-in screen to instantly access the full app.

---

## 🏗️ Architecture

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML/CSS/JS + Tailwind CSS (CDN) |
| AI Model | Grok API (`grok-3-latest`) via X.AI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Fonts | Google Fonts — Manrope + Material Symbols |

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Onboarding** | Role selection (Farmer / Researcher / Student) |
| **Login / Signup** | Supabase auth with demo account option |
| **Home Dashboard** | Personalized greeting, quick actions, recent diagnoses |
| **AI Chatbot** | Real-time chat with Grok AI for crop diagnosis |
| **Diagnosis Result** | Full report with confidence ring, treatment protocol |
| **Research Forum** | Community posts with upvoting, filtering, post creation |
| **Research Papers** | Searchable/filterable archive with bookmarking |
| **Profile** | User stats, settings, logout |

---

## 🔑 Credentials

```
Supabase URL:        YOUR_SUPABASE_URL
Supabase Anon Key:  YOUR_SUPABASE_ANON_KEY
Grok API Key:        YOUR_GROK_API_KEY
```

---

## 🌿 Design System — "Living Laboratory"

Based on the **Verdant Logic** design system:
- **Primary** `#012d1d` — Deep botanical authority
- **Secondary** `#006c48` — Breath of life
- **Surface** `#f8faf8` — Organic canvas
- **No-Line Rule** — Depth through tonal layering, never borders
- **Font** — Manrope across all scales
- **Shadows** — Green-tinted `rgba(27,67,50,x)` only

---

## 🗄️ Database Setup (Supabase)

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/jochdexnhwisqkklbeua/sql)
2. Paste the contents of `supabase_schema.sql`
3. Click **Run**

Tables created:
- `profiles` — User profiles (auto-created on signup)
- `diagnoses` — Saved crop diagnoses
- `forum_posts` — Community forum posts
- `research_papers` — Research archive
- `saved_papers` — User bookmarks

---

## 💡 Features

### AI Diagnosis
- Real Grok API integration (`grok-3-latest` model)
- Agricultural pathologist system prompt
- Chat history maintained per session
- Auto-detects disease mentions → shows diagnosis report
- Saves diagnoses to Supabase

### Forum
- Real posts stored in Supabase
- Falls back to curated sample posts
- Upvoting, tag filtering, role badges

### Research Papers
- Client-side search + filter (crop type, disease)
- Bookmarking (local state)
- Seeded sample papers in DB

---

## 📦 File Structure

```
agrisense_app/
├── index.html          ← Complete SPA (all screens)
├── supabase_schema.sql ← Database setup
└── README.md           ← This file
```

---

## ⚙️ Deploying

Since this is a single HTML file, you can deploy it anywhere:
- **Netlify Drop** — drag the folder to netlify.com/drop
- **GitHub Pages** — push to a repo, enable Pages
- **Vercel** — `vercel --prod` in the folder
- **Any static host** — just upload `index.html`

No build tools, no Node.js, no configuration needed.
