
import { Part } from "@google/genai";

/**
 * Converts a File object to a GoogleGenAI.Part object.
 * This involves reading the file as a data URL and extracting the base64 content and mimeType.
 */
export const fileToGenerativePart = (file: File): Promise<Part> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      
      if (!base64Data) {
          return reject(new Error("Could not extract base64 data from file."));
      }

      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
  });
};
