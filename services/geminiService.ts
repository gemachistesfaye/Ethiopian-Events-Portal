
import { GoogleGenAI, Modality } from "@google/genai";
import { ChatMessage } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches a short cultural insight.
 */
export async function getCulturalInsight(eventName: string, description: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, fascinating cultural insight or historical fact about the Ethiopian festival "${eventName}". Context: ${description}. Max 60 words.`,
    });
    return response.text || "Insight unavailable.";
  } catch (error) {
    return "Unable to fetch AI insights.";
  }
}

/**
 * Generates a random piece of Ethiopian cultural trivia.
 */
export async function generateCulturalTrivia(): Promise<{question: string, answer: string, explanation: string} | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate one interesting multiple-choice trivia question about Ethiopian culture, history, or geography. Return the result in a clean JSON format with keys: 'question', 'answer' (the correct option), and 'explanation'.",
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Trivia error:", error);
    return null;
  }
}

/**
 * Generates audio for Amharic pronunciation using Gemini TTS.
 */
export async function speakAmharic(text: string): Promise<Uint8Array | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Pronounce the following Amharic word or phrase clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

/**
 * Heritage Guide Chat functionality.
 */
export async function chatWithHeritageGuide(history: ChatMessage[], message: string): Promise<string> {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are an expert Ethiopian Heritage Guide. You have deep knowledge of Ethiopian history, geography, languages (Amharic, Oromo, Tigrinya, etc.), and diverse cultures. Answer questions about Ethiopia with respect, accuracy, and passion. Keep responses engaging and informative.",
      },
    });
    
    // Add history
    // Note: sendMessage usually takes the text directly
    const response = await chat.sendMessage({ message });
    return response.text || "I apologize, I'm unable to answer that right now.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "The guide is currently resting. Please try again soon.";
  }
}
