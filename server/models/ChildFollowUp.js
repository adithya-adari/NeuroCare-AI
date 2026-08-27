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
      enum: [
        "Pending",
        "Completed",
      ],
      default: "Pending",
    },

    /* =====================================================
       ASHA WORKER OWNERSHIP

       Links this follow-up to the ASHA worker
       who created it.

       Optional temporarily so existing follow-ups
       remain valid during migration.
    ===================================================== */

    ashaWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ASHAWorker",
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChildFollowUp =
  mongoose.model(
    "ChildFollowUp",
    childFollowUpSchema
  );

export default ChildFollowUp;