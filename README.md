
# 🌍 Ethiopian Heritage Portal: A Cultural Intelligence Platform

**Developed by Gemachis | Data & Dev**

An advanced, interactive web portal designed to preserve and explore Ethiopian culture through a unique dual-calendar system, AI-powered insights, and private cultural planning. This project serves as a showcase of modern frontend engineering, complex state management, and seamless GenAI integration.

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
- **Cultural Insights:** Automated generation of fasinating facts for every major festival.
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

- **Frontend:** React 19 (ES6 Modules)
- **Styling:** Tailwind CSS (Modern, mobile-first, luxury aesthetic)
- **Intelligence:** Google Gemini 3 Flash & Gemini 2.5 Flash (TTS)
- **Date Logic:** Custom-built JDN conversion utilities
- **State Management:** React Hooks (UseMemo, UseEffect, UseState)

---

## 📂 Project Structure

```text
ethiopian-heritage-portal/
├── components/          # Modular UI components (Calendar, Chat, Trivia)
├── services/            # Gemini API integration and AI logic
├── utils/               # Calendar conversion and JDN utilities
├── constants/           # Heritage data and event definitions
├── types.ts             # Strict TypeScript definitions
└── App.tsx              # Main application architecture
```

---

## 🚀 About the Developer

### **Gemachis | Data & Dev**
*Architecting intelligent cultural experiences. Merging ancient heritage with cutting-edge software engineering.*

**Gemachis Tesfaye**  
*Lead Software Engineer | Data Specialist*

Contact for collaborations or inquiries:

- **Telegram:** [Connect on Telegram](https://t.me/your_telegram) ✈️
- **GitHub:** [Explore Code](https://github.com/your_github) 💻
- **Email:** [Send an Inquiry](mailto:your_email@domain.com) 📧
- **Phone:** [+251 900 000 000](tel:+251900000000) 📞

---

**All Rights Reserved © 2026**
