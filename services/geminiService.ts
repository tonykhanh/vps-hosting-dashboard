
import { GoogleGenAI, Type } from "@google/genai";

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

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// We assume this variable is pre-configured, valid, and accessible.
const apiKey = process.env.API_KEY;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } else {
    console.warn("Autonix AI: No API Key found. Please set process.env.API_KEY.");
  }
} catch (error) {
  console.error("Autonix AI: Failed to initialize.", error);
}

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!ai) {
    return "AI Core Offline: API Key missing. Please configure process.env.API_KEY.";
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
    return "Error communicating with the Action Graph Engine. Check console for details.";
  }
};

// Types for the intent analysis
export interface IntentAnalysisResult {
  blueprintId: string;
  name: string;
  domain: string;
  region: string;
  reasoning: string;
}

export const analyzeInfrastructureIntent = async (intent: string): Promise<IntentAnalysisResult | null> => {
  if (!ai) {
    console.warn("Autonix AI: No API Key found.");
    return null;
  }

  const prompt = `Analyze the following user intent for deploying cloud infrastructure. 
  Map it to the closest available options.
  
  Available Blueprints (blueprintId): 
  - 'WORDPRESS' (for e-commerce, shops, blogs, content sites)
  - 'NODEJS' (for APIs, backends, javascript apps)
  - 'LARAVEL' (for php apps, enterprise)
  - 'STATIC' (for landing pages, portfolios, simple sites)
  - 'DOCKER' (for containers, microservices)

  Available Regions (region): 'sg-1' (Singapore/Asia), 'vn-1' (Vietnam), 'jp-1' (Japan), 'us-west' (USA). Default to 'sg-1' if unsure.

  User Intent: "${intent}"
  
  Generate a creative Project Name and Domain if not specified.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blueprintId: { type: Type.STRING },
            name: { type: Type.STRING },
            domain: { type: Type.STRING },
            region: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["blueprintId", "name", "domain", "region"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as IntentAnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Autonix Intent Analysis Error:", error);
    return null;
  }
};
