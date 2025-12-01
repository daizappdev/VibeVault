import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { VibeAnalysisResult, ScrapbookStory, Post } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an uploaded image to determine its "Vibe" and "Authenticity Score".
 * VibeVault uses this to tag moments and encourage realness.
 */
export const analyzeImageVibe = async (base64Image: string, caption: string): Promise<VibeAnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: `Analyze this social media photo for a Gen Z app called VibeVault. 
            The app values authenticity, rawness, and "real" moments over curated perfection.
            
            Caption provided by user: "${caption}"
            
            1. Generate 3 short, slang-heavy "vibe tags" (e.g., "chaotic good", "main character", "cozy core").
            2. Give an "authenticity score" from 1 to 100 based on how candid and unedited it looks. Higher is better/more authentic.
            3. Write a one-sentence "vibe check" description.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            authenticityScore: { type: Type.NUMBER },
            vibeDescription: { type: Type.STRING }
          },
          required: ["tags", "authenticityScore", "vibeDescription"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VibeAnalysisResult;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      tags: ["mysterious", "loading", "vibe"],
      authenticityScore: 85,
      vibeDescription: "The vibe is loading..."
    };
  }
};

/**
 * Generates a "Digital Scrapbook" story based on recent posts in a vault.
 */
export const generateScrapbookStory = async (posts: Post[], vaultName: string): Promise<ScrapbookStory> => {
  try {
    // Prepare text summary of posts for the model
    const postsSummary = posts.map(p => 
      `User ${p.userName} posted a photo tagged [${p.aiVibeTags.join(', ')}] with caption "${p.caption}" on ${p.timestamp.toDateString()}. Authenticity: ${p.authenticityScore}/100.`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are the AI narrator for VibeVault. Write a short, nostalgic, and fun weekly recap for a friend group called "${vaultName}".
      
      Here is the data from this week's "Moment Drops":
      ${postsSummary}
      
      Style: Casual, Gen Z slang, heartwarming but not cringe. Keep it under 100 words.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for this week's recap" },
            narrative: { type: Type.STRING, description: "The story text" },
            mood: { type: Type.STRING, description: "An emoji representing the overall mood" }
          },
          required: ["title", "narrative", "mood"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScrapbookStory;
    }

    throw new Error("No response from Gemini");

  } catch (error) {
    console.error("Scrapbook Generation Error:", error);
    return {
      title: "This Week's Vibe",
      narrative: "Looks like you guys had a great week, but I'm having trouble remembering the details right now!",
      mood: "🤖"
    };
  }
};
