import express from "express";
import Child from "../models/Child.js";

const router = express.Router();

/* -------------------- CREATE CHILD -------------------- */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      gender,
      motherName,
      village,
    } = req.body;

    const child = await Child.create({
      name,
      dateOfBirth,
      gender,
      motherName,
      village,
    });

    res.status(201).json({
      success: true,
      child,
    });

  } catch (error) {
    console.error(
      "Create child error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- GET ALL CHILDREN -------------------- */

router.get("/", async (req, res) => {
  try {
    const children =
      await Child.find().sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      children,
    });

  } catch (error) {
    console.error(
      "Get children error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- GET ONE CHILD -------------------- */

router.get("/:id", async (req, res) => {
  try {
    const child =
      await Child.findById(
        req.params.id
      );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    res.json({
      success: true,
      child,
    });

  } catch (error) {
    console.error(
      "Get child error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- UPDATE CHILD -------------------- */

router.put("/:id", async (req, res) => {
  try {
    const child =
      await Child.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    res.json({
      success: true,
      child,
    });

  } catch (error) {
    console.error(
      "Update child error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------------------- DELETE CHILD -------------------- */

router.delete("/:id", async (req, res) => {
  try {
    const child =
      await Child.findByIdAndDelete(
        req.params.id
      );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    res.json({
      success: true,
      message:
        "Child deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete child error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;