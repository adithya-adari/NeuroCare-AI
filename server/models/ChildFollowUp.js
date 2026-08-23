import mongoose from "mongoose";

const childFollowUpSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    childName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ChildFollowUp = mongoose.model(
  "ChildFollowUp",
  childFollowUpSchema
);

export default ChildFollowUp;