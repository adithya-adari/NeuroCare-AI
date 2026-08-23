import express from "express";
import MotherFollowUp from "../models/MotherFollowUp.js";
import Mother from "../models/Mother.js";

const router = express.Router();

/* =====================================================
   CREATE MOTHER FOLLOW-UP
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      motherId,
      date,
      note = "",
    } = req.body;

    if (!motherId || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Mother ID and follow-up date are required.",
      });
    }

    const mother =
      await Mother.findById(motherId);

    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "Mother not found.",
      });
    }

    const followUp =
      await MotherFollowUp.create({
        motherId: mother._id,
        motherName: mother.name,
        date,
        note,
        status: "Pending",
      });

    res.status(201).json({
      success: true,
      message:
        "Mother follow-up scheduled successfully.",
      followUp,
    });

  } catch (error) {
    console.error(
      "Create mother follow-up error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* =====================================================
   GET ALL MOTHER FOLLOW-UPS
===================================================== */

router.get("/", async (req, res) => {
  try {
    const followUps =
      await MotherFollowUp.find()
        .populate(
          "motherId",
          "name age mobile village pregnancyStatus expectedDeliveryDate"
        )
        .sort({
          date: 1,
          createdAt: -1,
        });

    res.json({
      success: true,
      followUps,
    });

  } catch (error) {
    console.error(
      "Get mother follow-ups error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* =====================================================
   GET FOLLOW-UPS FOR ONE MOTHER
===================================================== */

router.get(
  "/mother/:motherId",
  async (req, res) => {
    try {
      const { motherId } = req.params;

      const followUps =
        await MotherFollowUp.find({
          motherId,
        }).sort({
          date: 1,
          createdAt: -1,
        });

      res.json({
        success: true,
        followUps,
      });

    } catch (error) {
      console.error(
        "Get mother-specific follow-ups error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* =====================================================
   MARK MOTHER FOLLOW-UP COMPLETED
===================================================== */

router.put(
  "/:id/complete",
  async (req, res) => {
    try {
      const followUp =
        await MotherFollowUp.findByIdAndUpdate(
          req.params.id,
          {
            status: "Completed",
          },
          {
            new: true,
          }
        );

      if (!followUp) {
        return res.status(404).json({
          success: false,
          message: "Follow-up not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Mother follow-up marked as completed.",
        followUp,
      });

    } catch (error) {
      console.error(
        "Complete mother follow-up error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


/* =====================================================
   DELETE MOTHER FOLLOW-UP
===================================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const followUp =
        await MotherFollowUp.findByIdAndDelete(
          req.params.id
        );

      if (!followUp) {
        return res.status(404).json({
          success: false,
          message: "Follow-up not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Mother follow-up deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete mother follow-up error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to delete mother follow-up.",
      });
    }
  }
);


export default router;