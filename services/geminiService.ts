import { ChatMessage } from "../types";

/* ================================
   CONFIG (VITE)
================================ */
const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2
].filter(Boolean) as string[];

if (API_KEYS.length === 0) {
  console.warn("⚠️ No Gemini API keys found");
  throw new Error("Missing Gemini API key");
}

let currentKeyIndex = 0;
const getApiKey = () => API_KEYS[currentKeyIndex];
const rotateKey = () => {
  if (API_KEYS.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log("🔄 Switched to API key", currentKeyIndex + 1);
  }
};

const TEXT_MODEL = "gemini-2.5-flash";
const TTS_MODEL = "gemini-2.5-flash";

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
   FETCH WITH RETRY + KEY ROTATION
================================ */
async function fetchWithRetry(
  urlTemplate: string,
  options: RequestInit,
  retries = 3
) {
  for (let i = 0; i < retries; i++) {
    try {
      const url = urlTemplate.replace(/key=[^&]+/, `key=${getApiKey()}`);
      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));

      if (res.ok) return data;

      console.error("❌ Gemini error:", res.status, data);

      /* 🟡 RATE LIMIT — rotate to next key */
      if (res.status === 429) {
        console.warn("⏳ Rate limited — rotating API key...");
        rotateKey();
        await new Promise(r => setTimeout(r, 1000));
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
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
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
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
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
      `${BASE_URL}/${TTS_MODEL}:generateContent?key=${getApiKey()}`,
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
  message: string,
  mode: 'guide' | 'storyteller' | 'teacher' | 'festival' | 'myth' = 'guide'
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

    const instructions = {
      guide: "You are an expert Ethiopian Heritage Guide. Answer with passion, clarity, and cultural pride.",
      storyteller: "You are a master Ethiopian historical storyteller. Narrate events as if they are epic tales, with rich descriptions and emotional weight. Make the user feel like they are there. Use cinematic language.",
      teacher: "You are a patient and knowledgeable Ethiopian cultural teacher. Explain traditions, rituals, and customs step-by-step, making them easy to understand for students.",
      festival: "You are a vibrant festival explainer. Describe Ethiopian festivals with colors, sounds, and excitement, as if the user is attending them.",
      myth: "You are a keeper of Ethiopian myths and legends. Narrate ancient stories, folktales, and mysteries with a sense of wonder and magic."
    };

    console.log("🟢 Calling Gemini API with mode:", mode, "message:", message);

    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text: instructions[mode]
              }
            ]
          }
        })
      }
    );

    console.log("🔵 Gemini API result:", JSON.stringify(result)?.slice(0, 500));

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("🔴 No text in result. Full result:", JSON.stringify(result));
      return "The guide could not generate a response. Please try again.";
    }

    return text;
  } catch (err) {
    console.error("🔴 Heritage Guide error:", err);
    return "The guide encountered an error. Please try again.";
  }
}