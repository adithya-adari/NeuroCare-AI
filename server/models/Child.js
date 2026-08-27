import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Other",
      ],
      required: true,
    },

    motherName: {
      type: String,
      required: true,
      trim: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       ASHA WORKER OWNERSHIP

       Each child belongs to the ASHA worker who
       registered the child.

       Kept optional temporarily so existing
       children continue to remain valid.
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

const Child = mongoose.model(
  "Child",
  childSchema
);

export default Child;