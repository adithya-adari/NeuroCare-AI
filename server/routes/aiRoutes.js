import express from "express";
import { generateAIResponse } from "../services/geminiService.js";

const router = express.Router();

/* -------------------- AI CHAT -------------------- */

router.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
You are NeuroCare AI.

You are a friendly AI assistant for parents.

Answer in simple, clear language.

Do NOT return JSON.

Do NOT diagnose diseases.

If symptoms sound serious, advise consulting a pediatrician.

Question:
${question}
`;

    const response = await generateAIResponse(prompt);

    res.json({
      success: true,
      response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      response:
        "⚠️ NeuroCare AI is temporarily unavailable because the AI service has reached its usage limit. Please try again later.",
    });
  }
});

/* -------------------- ASSESSMENT -------------------- */

router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;

    const prompt = `
You are NeuroCare AI.

Assessment Answers:

${JSON.stringify(answers, null, 2)}

Analyze the assessment.

Return ONLY valid JSON.

{
"risk":"",
"summary":"",
"concerns":"",
"homeCare":"",
"doctor":"",
"disclaimer":""
}

Rules:

- Never diagnose SMA.
- Never say the child has any disease.
- Educational guidance only.
`;

    const response = await generateAIResponse(prompt);

    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch {
      parsed = JSON.parse(
        response.replace(/```json/g, "").replace(/```/g, "").trim()
      );
    }

    res.json({
      success: true,
      report: parsed,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;