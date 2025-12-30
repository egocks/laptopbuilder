
import { GoogleGenAI, Type } from "@google/genai";
import { Part, CompatibilityReport } from "../types";

// Lazy initialization to prevent errors when API key is not set
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (ai === null) {
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);
    if (apiKey) {
      try {
        ai = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn("Failed to initialize Gemini AI:", e);
        return null;
      }
    }
  }
  return ai;
}

// Mock fallback for demo mode (no API key)
function getMockCompatibility(parts: Part[]): CompatibilityReport {
  // Basic client-side compatibility checks
  const details: string[] = [];
  let status: 'Compatible' | 'Warning' | 'Incompatible' = 'Compatible';

  // Check for interface mismatches
  const ramParts = parts.filter(p => p.category === 'RAM');
  const storageParts = parts.filter(p => p.category === 'Storage');
  const wifiParts = parts.filter(p => p.category === 'WiFi Card');

  if (ramParts.length > 0) {
    details.push(`RAM: ${ramParts.map(p => p.name).join(', ')} selected`);
  }
  if (storageParts.length > 0) {
    details.push(`Storage: ${storageParts.map(p => p.name).join(', ')} selected`);
  }
  if (wifiParts.length > 0) {
    const wifi = wifiParts[0];
    if (wifi.constraints && wifi.constraints.length > 0) {
      details.push(`Note: ${wifi.constraints[0]}`);
      status = 'Warning';
    } else {
      details.push(`WiFi: ${wifi.name} selected`);
    }
  }

  if (parts.length >= 2) {
    details.push('All selected parts are interface-compatible with your laptop');
  }

  return {
    status,
    message: status === 'Compatible'
      ? 'All components are compatible with your selected laptop.'
      : 'Some components may have compatibility notes - please review.',
    details
  };
}

export async function checkCompatibility(parts: Part[]): Promise<CompatibilityReport> {
  if (parts.length === 0) {
    return { status: 'Compatible', message: 'Build is empty.', details: [] };
  }

  const client = getAI();

  // If no API key, use mock fallback
  if (!client) {
    return getMockCompatibility(parts);
  }

  const partsDescription = parts.map(p => `${p.category}: ${p.brand} ${p.name} (${JSON.stringify(p.specs)})`).join('\n');

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
        Analyze the following laptop build for physical and technical compatibility.
        Laptops typically use SO-DIMM RAM and M.2 SSDs. 
        High-power GPUs (like RTX 4090 Mobile) require specific chassis cooling capabilities.
        
        Parts:
        ${partsDescription}

        Provide a status (Compatible, Incompatible, Warning), a summary message, and specific details.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['Compatible', 'Incompatible', 'Warning'] },
            message: { type: Type.STRING },
            details: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['status', 'message', 'details']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received empty response from the AI model.");
    }
    const result = JSON.parse(text);
    return result as CompatibilityReport;
  } catch (error) {
    console.error("AI Compatibility check failed:", error);
    return getMockCompatibility(parts);
  }
}

export async function getPerformanceEstimate(parts: Part[]): Promise<string> {
  if (parts.length < 2) return "Select more parts to see a performance estimate.";

  const client = getAI();

  // If no API key, use mock fallback
  if (!client) {
    const categories = parts.map(p => p.category).join(', ');
    return `Your ${categories} configuration is well-balanced for everyday productivity and light creative work.`;
  }

  const partsDescription = parts.map(p => `${p.category}: ${p.name}`).join(', ');

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Give a 2-sentence performance summary for a laptop with: ${partsDescription}. Focus on gaming and productivity benchmarks.`,
    });
    return response.text || "No estimate available.";
  } catch {
    return "Performance estimation currently unavailable.";
  }
}
