# Getting Started

## Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Google Gemini API Key** (for AI features)
- A **Supabase Project** (for authentication)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gemachistesfaye/Ethiopian-Events-Portal.git
cd Ethiopian-Events-Portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following keys:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

---

## Building for Production

```bash
npm run build
```

The optimized production bundle will be output to the `dist/` directory.

---

## Key Environment Variables

| Variable | Description |
|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI chat, trivia & TTS |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key |

---

## Offline Mode

If API keys are not configured or if the API is unreachable, the portal automatically activates its **built-in offline fallback registry** — so all non-AI features (calendar, map, timeline, culture zone) remain fully functional.

---

*Built by Gemachis Tesfaye — All Rights Reserved © 2026*
