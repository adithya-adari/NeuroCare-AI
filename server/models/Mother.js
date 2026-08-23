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