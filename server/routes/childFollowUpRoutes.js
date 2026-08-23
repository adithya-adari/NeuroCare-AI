import express from "express";
import ChildFollowUp from "../models/ChildFollowUp.js";
import Child from "../models/Child.js";

const router = express.Router();

/* =====================================================
   CREATE CHILD FOLLOW-UP
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      childId,
      date,
      note = "",
    } = req.body;

    if (!childId || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Child ID and follow-up date are required.",
      });
    }

    const child = await Child.findById(childId);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found.",
      });
    }

    const followUp =
      await ChildFollowUp.create({
        childId: child._id,
        childName: child.name,
        date,
        note,
        status: "Pending",
      });

    res.status(201).json({
      success: true,
      message:
        "Child follow-up scheduled successfully.",
      followUp,
    });

  } catch (error) {
    console.error(
      "Create child follow-up error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* =====================================================
   GET ALL CHILD FOLLOW-UPS
===================================================== */

router.get("/", async (req, res) => {
  try {
    const followUps =
      await ChildFollowUp.find()
        .populate(
          "childId",
          "name dateOfBirth gender motherName village"
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
      "Get child follow-ups error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/* =====================================================
   GET FOLLOW-UPS FOR ONE CHILD
===================================================== */

router.get(
  "/child/:childId",
  async (req, res) => {
    try {
      const { childId } = req.params;

      const followUps =
        await ChildFollowUp.find({
          childId,
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
        "Get child-specific follow-ups error:",
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
   MARK CHILD FOLLOW-UP COMPLETED
===================================================== */

router.put(
  "/:id/complete",
  async (req, res) => {
    try {
      const followUp =
        await ChildFollowUp.findByIdAndUpdate(
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
          "Child follow-up marked as completed.",
        followUp,
      });

    } catch (error) {
      console.error(
        "Complete child follow-up error:",
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
   DELETE CHILD FOLLOW-UP
===================================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const followUp =
        await ChildFollowUp.findByIdAndDelete(
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
          "Child follow-up deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete child follow-up error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


export default router;