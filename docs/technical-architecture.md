# Technical Architecture

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **UI Framework** | React 19 (JSX) | Component-based UI rendering |
| **Build Tool** | Vite | Fast dev server & production bundler |
| **Styling** | Tailwind CSS | Utility-first responsive styling |
| **AI Engine** | Google Gemini Flash 3 & 2.5 | Chat, trivia generation & Amharic TTS |
| **Auth & DB** | Supabase | User auth, session management |
| **Mapping** | React-Leaflet + OpenStreetMap | Real-world interactive map |
| **Localization** | i18next | Multi-language support (EN, AM, OM) |
| **Animation** | Framer Motion | Premium UI transitions |
| **GeoData** | TopoJSON → GeoJSON | Ethiopian region boundaries |

## Project Structure

```
ethiopian-heritage-portal/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx          # Dual-calendar engine
│   │   ├── CulturalMap.jsx       # Interactive regional atlas
│   │   ├── HeritageChat.jsx      # AI chatbot interface
│   │   ├── HistoricalTimeline.jsx# Chronological event archive
│   │   ├── CultureZone.jsx       # Trivia & cultural explorer
│   │   ├── Auth.jsx              # Login / signup / reset
│   │   ├── LandingPage.jsx       # Home & featured festivals
│   │   ├── MyReminders.jsx       # Private heritage vault
│   │   ├── EventDetails.jsx      # Full event detail modal
│   │   └── VoiceNarrator.jsx     # Amharic audio narrator
│   ├── services/
│   │   └── geminiService.js      # All Gemini API calls
│   ├── utils/                    # JDN calendar conversion algorithms
│   ├── locales/                  # en.json, am.json, om.json
│   ├── App.jsx                   # Main router & state manager
│   ├── constants.js              # All static cultural data
│   ├── i18n.js                   # i18next config
│   └── index.css                 # Global CSS tokens
├── docs/                         # Project documentation
├── assets/                       # Screenshot images
├── index.html
└── vite.config.js
```

## State Management

The app uses **native React Hooks** exclusively:
- `useState` — local component state
- `useEffect` — lifecycle and side effects
- `useMemo` — expensive calendar computations
- `useRef` — DOM references for chat scroll

## Data Flow

```
User Interaction
      ↓
React Component (JSX)
      ↓
geminiService.js (API call OR offline fallback)
      ↓
Gemini API / Local Registry
      ↓
State update → Re-render
```

---

*Built by Gemachis Tesfaye — All Rights Reserved © 2026*
