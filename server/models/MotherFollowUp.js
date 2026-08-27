import mongoose from "mongoose";

const motherFollowUpSchema = new mongoose.Schema(
  {
    motherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mother",
      required: true,
    },

    motherName: {
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
       
       Kept optional temporarily so existing
       follow-ups remain valid.
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

const MotherFollowUp =
  mongoose.model(
    "MotherFollowUp",
    motherFollowUpSchema
  );

export default MotherFollowUp;