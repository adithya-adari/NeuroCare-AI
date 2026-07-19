import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIResponse(question) {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: question,
  });

  return response.text;
}