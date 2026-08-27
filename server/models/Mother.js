import mongoose from "mongoose";

const motherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    pregnancyStatus: {
      type: String,
      enum: [
        "Pregnant",
        "Postpartum",
        "Not Pregnant",
      ],
      required: true,
    },

    expectedDeliveryDate: {
      type: String,
      default: "",
    },

    /* =====================================================
       ASHA WORKER OWNERSHIP

       Each mother can belong to one ASHA worker.
       Kept optional temporarily so existing records
       continue working while we migrate the system.
    ===================================================== */

    ashaWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AshaWorker",
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mother = mongoose.model(
  "Mother",
  motherSchema
);

export default Mother;