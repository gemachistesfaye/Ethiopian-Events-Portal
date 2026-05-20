# 🌍 Ethiopian Heritage Portal: A Cultural Intelligence Platform

![Ethiopian Heritage Banner](docs/banner.svg)

An advanced, interactive web portal designed to preserve and explore Ethiopian culture through a unique dual-calendar system, AI-powered insights, and private cultural planning. This project serves as a showcase of modern frontend engineering, complex state management, and seamless GenAI integration.

---

## 📸 Platform Interface Preview

<table>
  <tr>
    <td align="center" width="50%">
      <img src="assets/screenshot1.png" width="100%" height="320" style="object-fit:cover; border-radius:8px;" alt="Calendar View"/>
      <br/><b>📅 Dual Calendar View</b>
    </td>
    <td align="center" width="50%">
      <img src="assets/screenshot2.png" width="100%" height="320" style="object-fit:cover; border-radius:8px;" alt="Heritage Map"/>
      <br/><b>🗺️ Interactive Heritage Map</b>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="assets/screenshot3.png" width="100%" height="320" style="object-fit:cover; border-radius:8px;" alt="AI Chatbot"/>
      <br/><b>🤖 AI Heritage Guide</b>
    </td>
    <td align="center" width="50%">
      <img src="assets/screenshot4.png" width="100%" height="320" style="object-fit:cover; border-radius:8px;" alt="Culture Zone"/>
      <br/><b>🎉 Culture Zone & Trivia</b>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="assets/screenshot5.png" width="100%" height="320" style="object-fit:cover; border-radius:8px;" alt="Historical Timeline"/>
      <br/><b>📜 Historical Timeline Archive</b>
    </td>
    <td align="center" width="50%">
      <img src="assets/screenshot6.png" width="100%" height="320" style="object-fit:cover; border-radius:8px;" alt="Featured Festivals"/>
      <br/><b>🌄 Featured Festivals</b>
    </td>
  </tr>
</table>

---

## 🌟 Key Features

### 📅 Advanced Dual-Calendar System
The heart of the portal is a high-precision calendar engine that synchronizes the **Gregorian** and **Ethiopian (Ge'ez)** calendars. 
- **13-Month Support:** Full handling of the Ethiopian 13th month (*Pagumē*).
- **Precise Conversion:** Implements the Julian Day Number (JDN) algorithm for zero-offset accuracy between calendar systems.
- **Integrated Events:** View cultural, religious, and public holidays mapped across both timelines.

### 🤖 AI Heritage Guide & Insights
Leveraging the **Google Gemini API**, the portal provides deep cultural immersion:
- **Heritage Guide (Chat):** A real-time AI assistant trained to answer complex questions about Ethiopian history, traditions, and geography.
- **Cultural Insights:** Automated generation of fascinating facts for every major festival.
- **Amharic TTS:** High-fidelity text-to-speech for correct Amharic pronunciation of event names.

### 🏺 Private Heritage Box (Reminder System)
A secure, client-side reminder system for personal cultural planning:
- **Priority & Categorization:** Organize plans with 'Religious', 'Travel', or 'Social' tags and set 'Low' to 'High' priorities.
- **Local Persistence:** All data is stored privately in the user's browser via `localStorage`, ensuring privacy and speed.

### ✨ Culture Zone
- **AI Trivia:** Dynamically generated multiple-choice questions about Ethiopian heritage.
- **Interactive Exploration:** Thematic cards covering Food, Music, and History.

---

## 🛠️ Technical Stack

| Technology | Purpose |
|---|---|
| **React 19** + Vite 6 | UI framework & build tooling |
| **Tailwind CSS** + Framer Motion | Styling & animations |
| **Google Gemini API** | AI chat, trivia generation & Amharic TTS |
| **Supabase** | User authentication & session management |
| **Leaflet** + React-Leaflet + topojson-client | Interactive map & regional GeoJSON rendering |
| **i18next** + react-i18next | Multi-language support (EN / AM / OM) |
| **Custom JDN Algorithm** | Ethiopian ↔ Gregorian calendar conversion |

---

## 📂 Project Structure

```text
ethiopian-heritage-portal/
├── src/
│   ├── components/      # Modular UI components (Calendar, Chat, Trivia) in JS/JSX
│   ├── services/        # Gemini API integration and AI logic
│   ├── utils/           # Calendar conversion and JDN utilities
│   ├── locales/         # Translation JSON files for en, am, and om
│   ├── App.jsx          # Main application component
│   ├── constants.js     # Heritage data and event definitions
│   ├── i18n.js          # Localization framework configuration
│   ├── index.css        # Global CSS / styling
│   └── index.jsx        # React root mount entry point
├── index.html           # Main HTML document
└── vite.config.js       # Vite build tool config
```

---

## ⚠️ System Limitations & Fallbacks

> [!CAUTION]
> **API Connectivity** — AI chat, trivia & TTS require an active internet connection. Falls back to a built-in offline registry with 100+ trivia questions & historical data.

> [!CAUTION]
> **Data Persistence** — Heritage vault reminders are stored in `localStorage` only. Does not sync across devices or private browsing sessions.

> [!CAUTION]
> **Map Boundaries** — Regional GeoJSON is fetched on page load and requires internet. Region summaries & cultural profiles remain interactive offline.

> [!CAUTION]
> **Supabase Auth** — Login, signup & password reset require an active internet connection. Session persists locally until expiry.

---

## 🚀 About the Developer

**Gemachis Tesfaye**  
*Software Engineer*

- **GitHub**: [@gemachistesfaye](https://github.com/gemachistesfaye)
- **Telegram**: [@urjiiko1](https://t.me/urjiiko1)
- **Email**: [gemachistesfaye36@gmail.com](mailto:gemachistesfaye36@gmail.com)

---

**All Rights Reserved © 2026**
