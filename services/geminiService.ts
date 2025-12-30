
import { GoogleGenAI, Type } from "@google/genai";
import { Part, CompatibilityReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function checkCompatibility(parts: Part[]): Promise<CompatibilityReport> {
  if (parts.length === 0) {
    return { status: 'Compatible', message: 'Build is empty.', details: [] };
  }

  const partsDescription = parts.map(p => `${p.category}: ${p.brand} ${p.name} (${JSON.stringify(p.specs)})`).join('\n');

  try {
    // Fixed: Upgraded to gemini-3-pro-preview for complex reasoning task and improved output extraction
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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
    return {
      status: 'Warning',
      message: 'Unable to verify compatibility with AI at this time.',
      details: ['Check slot types (SO-DIMM, M.2) manually.', 'Verify TGP limits for the chassis.']
    };
  }
}

export async function getPerformanceEstimate(parts: Part[]): Promise<string> {
  if (parts.length < 3) return "Select more parts to see a performance estimate.";

  const partsDescription = parts.map(p => `${p.category}: ${p.name}`).join(', ');

  try {
    // Fixed: Using gemini-3-flash-preview for a basic text summary task
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give a 2-sentence performance summary for a laptop with: ${partsDescription}. Focus on gaming and productivity benchmarks.`,
    });
    return response.text || "No estimate available.";
  } catch {
    return "Performance estimation currently unavailable.";
  }
}
