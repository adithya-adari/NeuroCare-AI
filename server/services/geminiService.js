import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIResponse(question, language = "en") {
  const maxRetries = 3;

  const languageInstructions = {
    en: `
Generate the response completely in English.
`,

    te: `
Generate the response completely in Telugu (తెలుగు).

IMPORTANT:
- Write the actual response content in Telugu.
- Do not write English sentences.
- Use Telugu script.
- Use simple Telugu that parents, ASHA workers, and doctors can understand.
- Medical terms may be written in commonly understood Telugu/English medical terminology only when necessary.
`,

    hi: `
Generate the response completely in Hindi (हिन्दी).

IMPORTANT:
- Write the actual response content in Hindi.
- Do not write English sentences.
- Use Devanagari script.
- Use simple Hindi that parents, ASHA workers, and doctors can understand.
- Medical terms may be written in commonly understood Hindi/English medical terminology only when necessary.
`,
  };

  const selectedLanguage =
    languageInstructions[language] ||
    languageInstructions.en;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        systemInstruction: `
You are NeuroCare AI.

You are an AI-assisted child health screening assistant for ASHA workers.

The selected output language is:

${language}

${selectedLanguage}

This language requirement is mandatory.

When the selected language is Telugu:
ALL natural-language content must be written in Telugu.

When the selected language is Hindi:
ALL natural-language content must be written in Hindi.

When the selected language is English:
ALL natural-language content must be written in English.

Do not switch to English just because the input information is in English.

If JSON is requested, keep the JSON keys exactly as requested,
but write the VALUES in the selected language.

Do not diagnose diseases.
Do not claim that a child has SMA or any other disease.
Provide screening guidance only.
If concerning symptoms are present, recommend communication with a qualified doctor or pediatrician.
`,

        contents: question,
      });

      return response.text;

    } catch (error) {

      console.log(
        `Gemini request failed. Attempt ${attempt}/${maxRetries}. Status: ${error.status}`
      );

      // Retry only temporary Gemini availability errors
      if (error.status === 503 && attempt < maxRetries) {

        const waitTime = attempt * 5000;

        console.log(
          `Gemini is temporarily busy. Retrying in ${waitTime / 1000} seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, waitTime)
        );

        continue;
      }

      throw error;
    }
  }

  throw new Error("Gemini AI is temporarily unavailable.");
}