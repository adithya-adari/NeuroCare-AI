import express from "express";
import Mother from "../models/Mother.js";

const router = express.Router();

/* -------------------- CREATE MOTHER -------------------- */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      age,
      mobile,
      village,
      pregnancyStatus,
      expectedDeliveryDate,
    } = req.body;

    const mother = await Mother.create({
      name,
      age,
      mobile,
      village,
      pregnancyStatus,
      expectedDeliveryDate,
    });

    res.status(201).json({
      success: true,
      mother,
    });
  } catch (error) {
    console.error(
      "Create mother error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- GET ALL MOTHERS -------------------- */

router.get("/", async (req, res) => {
  try {
    const mothers = await Mother.find()
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      mothers,
    });
  } catch (error) {
    console.error(
      "Get mothers error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- GET ONE MOTHER -------------------- */

router.get("/:id", async (req, res) => {
  try {
    const mother =
      await Mother.findById(
        req.params.id
      );

    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "Mother not found",
      });
    }

    res.json({
      success: true,
      mother,
    });
  } catch (error) {
    console.error(
      "Get mother error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- UPDATE MOTHER -------------------- */

router.put("/:id", async (req, res) => {
  try {
    const mother =
      await Mother.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "Mother not found",
      });
    }

    res.json({
      success: true,
      mother,
    });
  } catch (error) {
    console.error(
      "Update mother error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- DELETE MOTHER -------------------- */

router.delete("/:id", async (req, res) => {
  try {
    const mother =
      await Mother.findByIdAndDelete(
        req.params.id
      );

    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "Mother not found",
      });
    }

    res.json({
      success: true,
      message:
        "Mother deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete mother error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;