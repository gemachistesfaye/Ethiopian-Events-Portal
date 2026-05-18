import { ChatMessage } from "../types";

/* ================================
   CONFIG (VITE)
================================ */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ Gemini API key is missing");
  throw new Error("Missing Gemini API key");
}

const TEXT_MODEL = "gemini-2.0-flash";
const TTS_MODEL = "gemini-2.0-flash-exp";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/* ================================
   TYPES
================================ */
export interface Trivia {
  question: string;
  answer: string;
  explanation: string;
}

/* ================================
   FETCH WITH RETRY
================================ */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));

      if (res.ok) return data;

      console.error("❌ Gemini error:", res.status, data);

      /* 🟡 RATE LIMIT HANDLING */
      if (res.status === 429) {
        console.warn("⏳ Rate limited — waiting before retry...");
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      /* ❌ STOP retrying for client errors */
      if (res.status < 500) break;

      /* 🔁 exponential backoff for server errors */
      await new Promise(r => setTimeout(r, 2 ** i * 3000));
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }

  return null;
}

/* ================================
   TRIVIA
================================ */
export async function generateCulturalTrivia(): Promise<Trivia> {
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate one Ethiopian culture, history, or geography trivia.
Return STRICT JSON:
{
 "question": "...",
 "answer": "...",
 "explanation": "..."
}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty trivia response");

    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    console.warn("⚠️ Using fallback trivia");

    return {
      question:
        "Which Ethiopian city is known as the political capital of Africa?",
      answer: "Addis Ababa",
      explanation:
        "Addis Ababa hosts the African Union headquarters and many international organizations."
    };
  }
}

/* ================================
   CULTURAL INSIGHT
================================ */
export async function getCulturalInsight(
  eventName: string,
  description: string
): Promise<string> {
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Provide a short cultural insight about the Ethiopian festival "${eventName}".
Context: ${description}
Max 60 words.`
                }
              ]
            }
          ]
        })
      }
    );

    return (
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Insight unavailable."
    );
  } catch {
    return "Insight unavailable.";
  }
}

/* ================================
   AMHARIC TTS
================================ */
export async function speakAmharic(
  text: string
): Promise<Uint8Array | null> {
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TTS_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"]
          }
        })
      }
    );

    const base64 =
      result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64) return null;

    const binary = atob(base64);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  } catch (err) {
    console.error("TTS error:", err);
    return null;
  }
}

/* ================================
   HERITAGE GUIDE CHAT
================================ */
export async function chatWithHeritageGuide(
  history: ChatMessage[],
  message: string
): Promise<string> {
  try {
    const contents = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text:
                  "You are an expert Ethiopian Heritage Guide. Answer with passion, clarity, and cultural pride."
              }
            ]
          }
        })
      }
    );

    return (
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "The guide is resting right now."
    );
  } catch {
    return "The guide is resting right now.";
  }
}