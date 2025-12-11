import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const initializeGemini = () => {
  if (genAI) return;
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return;
  }
  
  genAI = new GoogleGenAI({ apiKey });
};

export const startChatSession = () => {
  initializeGemini();
  if (!genAI) throw new Error("AI Service not initialized");

  chatSession = genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }
  if (!chatSession) {
    return "AI Service is unavailable. Please check your API configuration.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I didn't receive a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request.";
  }
};
