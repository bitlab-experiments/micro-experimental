
import { GoogleGenAI, Modality, Part } from "@google/genai";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

interface EditImageResult {
    imageUrl: string | null;
    text: string | null;
}

export const editImage = async (imagePart: Part, prompt: string): Promise<EditImageResult> => {
  try {
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        // Must include both Modality.IMAGE and Modality.TEXT
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
          text = part.text;
        }
      }
    }

    if (!imageUrl) {
        throw new Error("The AI did not return an image. It might have refused the request.");
    }
    
    return { imageUrl, text };
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Re-throw a more user-friendly error
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while editing the image.");
  }
};
