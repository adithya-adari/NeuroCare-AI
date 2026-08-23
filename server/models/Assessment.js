import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    language: {
      type: String,
      enum: ["en", "te", "hi"],
      default: "en",
    },

    report: {
      risk: {
        type: String,
        enum: ["Low", "Moderate", "High"],
        required: true,
      },

      summary: {
        type: String,
        required: true,
      },

      concerns: {
        type: String,
        required: true,
      },

      homeCare: {
        type: String,
        required: true,
      },

      doctor: {
        type: String,
        required: true,
      },

      disclaimer: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;