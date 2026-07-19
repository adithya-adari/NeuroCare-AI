import express from "express";
import { generateAIResponse } from "../services/geminiService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;

    let prompt = "";

    if (answers.parentQuestion) {
      prompt = `
You are NeuroCare AI.

Answer the parent's question in simple language.

Question:
${answers.parentQuestion}

Never diagnose.
Always recommend consulting a pediatrician if needed.

Return ONLY valid JSON.

{
  "risk":"Low | Moderate | High",
  "summary":"",
  "concerns":"",
  "homeCare":"",
  "doctor":"",
  "disclaimer":""
}
`;
    } else {
      prompt = `
You are NeuroCare AI.

Assessment Answers:

${JSON.stringify(answers, null, 2)}

Analyze the assessment.

Return ONLY valid JSON.

{
  "risk":"Low | Moderate | High",
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
    }

    const response = await generateAIResponse(prompt);

    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch {
      const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
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