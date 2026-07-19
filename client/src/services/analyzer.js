function analyzeSymptoms(answers) {
  let score = 0;

  Object.values(answers).forEach((value) => {
    if (value === "Yes") {
      score++;
    }
  });

  if (score <= 2) {
    return {
      level: "Low Concern",
      color: "green",
      message:
        "Based on the reported information, there are currently few reported indicators associated with neuromuscular disorders. Continue monitoring your child's development and consult a healthcare professional if you have concerns.",
    };
  }

  if (score <= 5) {
    return {
      level: "Moderate Concern",
      color: "yellow",
      message:
        "Several reported observations may warrant further discussion with a pediatrician. This assessment is not a diagnosis and should not replace professional medical advice.",
    };
  }

  return {
    level: "High Concern",
    color: "red",
    message:
      "Multiple reported observations may require prompt evaluation by a pediatric neurologist. This tool cannot diagnose medical conditions. Please seek professional medical evaluation.",
    };
}

export default analyzeSymptoms;