import { ChatMessage } from "../types";

/* ================================
   CONFIG (VITE)
================================ */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ Gemini API key is missing");
  throw new Error("Missing Gemini API key");
}

const getApiKey = () => API_KEY;
const rotateKey = () => {};

const TEXT_MODEL = "gemini-2.0-flash";
const TTS_MODEL = "gemini-2.0-flash";

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
            response_modalities: ["AUDIO"],
            responseModalities: ["AUDIO"],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: {
                  voice_name: "Aoede"
                }
              }
            },
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Aoede"
                }
              }
            }
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
   OPENAI CONFIG
================================ */
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/* ================================
   HERITAGE GUIDE CHAT (OpenAI Primary + Gemini Fallback)
================================ */
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  guide: "You are an expert Ethiopian Heritage Guide. Answer with passion, clarity, and cultural pride. Keep answers concise but informative.",
  storyteller: "You are a master Ethiopian historical storyteller. Narrate events as if they are epic tales, with rich descriptions and emotional weight. Make the user feel like they are there. Use cinematic language.",
  teacher: "You are a patient and knowledgeable Ethiopian cultural teacher. Explain traditions, rituals, and customs step-by-step, making them easy to understand for students.",
  festival: "You are a vibrant festival explainer. Describe Ethiopian festivals with colors, sounds, and excitement, as if the user is attending them.",
  myth: "You are a keeper of Ethiopian myths and legends. Narrate ancient stories, folktales, and mysteries with a sense of wonder and magic."
};

async function chatWithOpenAI(
  history: ChatMessage[],
  message: string,
  mode: string
): Promise<string | null> {
  if (!OPENAI_KEY) return null;

  try {
    console.log("🟢 Calling OpenAI with mode:", mode);

    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTIONS[mode] || SYSTEM_INSTRUCTIONS.guide },
      ...history.map(msg => ({
        role: msg.role === "user" ? "user" as const : "assistant" as const,
        content: msg.text
      })),
      { role: "user" as const, content: message }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ OpenAI error:", res.status, data);
      return null;
    }

    const text = data?.choices?.[0]?.message?.content;
    if (text) {
      console.log("✅ OpenAI response received");
      return text;
    }

    return null;
  } catch (err) {
    console.error("❌ OpenAI fetch error:", err);
    return null;
  }
}

async function chatWithGemini(
  history: ChatMessage[],
  message: string,
  mode: string
): Promise<string | null> {
  try {
    console.log("🟡 Falling back to Gemini...");

    const contents = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: "user", parts: [{ text: message }] });

    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTIONS[mode] || SYSTEM_INSTRUCTIONS.guide }]
          }
        })
      }
    );

    return result?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

export async function chatWithHeritageGuide(
  history: ChatMessage[],
  message: string,
  mode: 'guide' | 'storyteller' | 'teacher' | 'festival' | 'myth' = 'guide'
): Promise<string> {
  // Try OpenAI first
  const openaiResult = await chatWithOpenAI(history, message, mode);
  if (openaiResult) return openaiResult;

  // Fallback to Gemini
  const geminiResult = await chatWithGemini(history, message, mode);
  if (geminiResult) return geminiResult;

  return "The guide is temporarily unavailable. Please try again in a moment.";
}