import express from "express";
import { generateAIResponse } from "../services/geminiService.js";
import Assessment from "../models/Assessment.js";

const router = express.Router();

/* -------------------- AI CHAT -------------------- */

router.post("/chat", async (req, res) => {
  try {
    const { question, language = "en" } = req.body;

    const languageInstructions = {
      en: "Answer in English.",
      te: "Answer completely in Telugu (తెలుగు). Use simple Telugu that parents and ASHA workers can easily understand.",
      hi: "Answer completely in Hindi (हिन्दी). Use simple Hindi that parents and ASHA workers can easily understand.",
    };

    const selectedLanguage =
      languageInstructions[language] ||
      languageInstructions.en;

    const prompt = `
You are NeuroCare AI.

You are a friendly AI assistant for ASHA workers.

${selectedLanguage}

Answer in simple, clear language.

Do NOT return JSON.

Do NOT diagnose diseases.

If symptoms sound serious, advise consulting a qualified doctor or pediatrician.

Question:
${question}
`;

    const response = await generateAIResponse(
      prompt,
      language
    );

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


/* -------------------- AI ASSESSMENT -------------------- */

router.post("/analyze", async (req, res) => {
  try {
    const {
      answers,
      language = "en",
    } = req.body;

    const languageNames = {
      en: "English",
      te: "Telugu",
      hi: "Hindi",
    };

    const selectedLanguage =
      languageNames[language] || "English";

    const prompt = `
You are NeuroCare AI, an AI-assisted child health screening tool for ASHA workers.

The ASHA worker has completed a basic child health screening assessment with the parent or guardian.

ASSESSMENT INFORMATION:

${JSON.stringify(answers, null, 2)}

TARGET OUTPUT LANGUAGE:

${selectedLanguage}

IMPORTANT LANGUAGE REQUIREMENT:

The actual AI-generated report content MUST be written completely in ${selectedLanguage}.

The following fields must contain content in ${selectedLanguage}:

- summary
- concerns
- homeCare
- doctor
- disclaimer

Do NOT return English sentences for these fields when the selected language is Telugu or Hindi.

If the selected language is Telugu:

- Write the report content in Telugu script.
- Use simple Telugu.
- Make it easy for ASHA workers and parents to understand.
- Do not merely translate the headings.
- The actual explanations must also be Telugu.

If the selected language is Hindi:

- Write the report content in Hindi script.
- Use simple Hindi.
- Make it easy for ASHA workers and parents to understand.
- Do not merely translate the headings.
- The actual explanations must also be Hindi.

If the selected language is English:

- Write the report content in English.

IMPORTANT MEDICAL SAFETY RULES:

- This is ONLY a screening assessment.
- Never diagnose SMA.
- Never say that the child has SMA.
- Never diagnose any disease.
- Do not replace a pediatrician or qualified healthcare professional.
- If concerning symptoms are present, clearly recommend that the ASHA worker communicate the concerns to the doctor.
- Give practical and simple guidance that an ASHA worker can explain to the parent.
- The report should support communication between the ASHA worker, parent/guardian, and doctor.

RISK LEVEL:

The "risk" field must contain ONLY one of:

Low
Moderate
High

The risk value is used internally by the application.

Return ONLY valid JSON.

{
  "risk": "",
  "summary": "",
  "concerns": "",
  "homeCare": "",
  "doctor": "",
  "disclaimer": ""
}

FINAL REQUIREMENTS:

1. Return valid JSON only.
2. Do not use Markdown.
3. Do not use a code block.
4. Do not add any explanation before or after the JSON.
5. The values of summary, concerns, homeCare, doctor and disclaimer MUST be completely written in ${selectedLanguage}.
6. Do not return English sentences inside Telugu or Hindi report content.
7. Keep the JSON property names exactly as shown.
`;

    const response = await generateAIResponse(
      prompt,
      language
    );

    let parsed;

    try {
      parsed = JSON.parse(response);
    } catch {
      parsed = JSON.parse(
        response
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
    }

    // Save assessment and AI report to MongoDB
    const savedAssessment = await Assessment.create({
      answers,
      language,
      report: parsed,
    });

    res.json({
      success: true,
      report: parsed,
      assessmentId: savedAssessment._id,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* -------------------- GET ASSESSMENTS FOR CHILD -------------------- */

router.get("/assessments/:childId", async (req, res) => {
  try {
    const { childId } = req.params;

    const assessments = await Assessment.find({
      "answers.childId": childId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      assessments,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* -------------------- GET ONE SAVED ASSESSMENT -------------------- */

router.get("/assessment-report/:assessmentId", async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findById(
      assessmentId
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.json({
      success: true,
      assessment,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* -------------------- GET ALL ASSESSMENTS -------------------- */

router.get("/assessments", async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      assessments,
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