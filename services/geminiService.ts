
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Autonix, an Autonomous Cloud Ops AI (2030 Edition).
Your role is to interpret user intent into infrastructure actions ("Action Graphs").
Context:
- Users are managing VPS, Domains, Kubernetes, and Security.
- Style: Concise, technical, futuristic, "Post-Dashboard" era.
- You do not need to write long paragraphs. Use bullet points or short confirmation steps.
- If a user asks to deploy, simulate the creation of a blueprint configuration.
- You have access to the following subsystems: Compute, Network, Storage, Security, Observability.

Current System State:
- Health: 98% (Excellent)
- Active Capsules: 3
- Region: Global

Always respond in a helpful, expert DevOps persona.`;

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("Autonix AI: No API_KEY found in environment.");
  }
} catch (error) {
  console.error("Autonix AI: Failed to initialize.", error);
}

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai) {
    return "AI Core Offline: API Key missing or initialization failed.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I processed the data but the response stream was empty.";
  } catch (error) {
    console.error("Autonix AI Error:", error);
    return "Error communicating with the Action Graph Engine.";
  }
};
