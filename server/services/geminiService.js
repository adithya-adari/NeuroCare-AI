import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIResponse(question) {
  let retries = 2;

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: question,
      });

      return response.text;
    } catch (error) {
      if (error.status === 503 && retries > 1) {
        console.log("Gemini busy. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries--;
        continue;
      }

      throw error;
    }
  }
}