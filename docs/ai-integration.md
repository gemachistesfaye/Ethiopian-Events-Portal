# AI Integration Guide

## Overview

The Ethiopian Heritage Portal is deeply integrated with the **Google Gemini API** to power three distinct AI-driven experiences. All AI features are built with graceful offline fallbacks so the app remains functional even without an internet connection.

## AI Features

### 1. Heritage Guide Chatbot

The flagship AI feature — a multi-personality conversational assistant that answers questions about Ethiopian history, culture, and traditions.

**Available Modes:**

| Mode | Description |
|---|---|
| 🌍 Heritage Guide | Factual expert on Ethiopian history & geography |
| 📜 Storyteller | Immersive narrative style — brings history to life |
| 🎓 Teacher | Step-by-step educational explanations |
| 🎉 Explainer | Documentary-style cultural breakdowns |
| 🦅 Narrator | Cinematic, dramatic oral tradition style |

**Model Used:** `gemini-3-flash`

**Persistence:** Chat history is saved to `localStorage` and survives page refreshes.

---

### 2. AI Culture Trivia

Dynamically generates multiple-choice trivia questions about Ethiopian heritage topics.

- Questions are context-aware and vary every session
- Covers history, food, music, festivals, geography, and language
- Falls back to a **100-question offline pool** if the API is unavailable

**Model Used:** `gemini-3-flash`

---

### 3. Amharic Text-to-Speech (TTS)

Any AI response in the Heritage Chat can be read aloud in Amharic using high-fidelity voice synthesis.

- Users click the **🔈 Listen** button on any AI message
- Audio is streamed, converted to a `Blob`, and played directly in the browser
- Fallback: graceful error message if TTS is unavailable

**Model Used:** `gemini-2.5-flash` (TTS capability)

---

## Offline Fallback Registry

When the Gemini API is unreachable, the app silently activates a built-in offline registry containing:

- Key historical events and narratives
- Country statistics and national symbols
- Language profiles for Amharic, Oromo, and Tigrinya
- 100 pre-written cultural trivia questions

This ensures **zero downtime** for the user experience.

---

*Built by Gemachis Tesfaye — All Rights Reserved © 2026*
