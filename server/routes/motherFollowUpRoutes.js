import express from "express";
import MotherFollowUp from "../models/MotherFollowUp.js";
import Mother from "../models/Mother.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ALL MOTHER FOLLOW-UP ROUTES REQUIRE AUTHENTICATION
===================================================== */

router.use(authMiddleware);

/* =====================================================
   GET LOGGED-IN ASHA WORKER ID
===================================================== */

const getWorkerId = (req) => {
  return (
    req.worker?.id ||
    req.worker?._id ||
    req.worker?.workerId
  );
};

/* =====================================================
   CREATE MOTHER FOLLOW-UP
===================================================== */

router.post("/", async (req, res) => {
  try {
    const workerId =
      getWorkerId(req);

    if (!workerId) {
      return res.status(401).json({
        success: false,
        message:
          "Unable to identify authenticated ASHA worker.",
      });
    }

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

    /* -----------------------------------------------
       IMPORTANT:
       Only allow follow-up for a mother belonging
       to the logged-in ASHA worker.
    ------------------------------------------------ */

    const mother =
      await Mother.findOne({
        _id: motherId,
        ashaWorker: workerId,
      });

    if (!mother) {
      return res.status(404).json({
        success: false,
        message:
          "Mother not found or does not belong to this ASHA worker.",
      });
    }

    const followUp =
      await MotherFollowUp.create({
        motherId: mother._id,
        motherName: mother.name,
        date,
        note,
        status: "Pending",
        ashaWorker: workerId,
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
   GET MOTHER FOLLOW-UPS
   ONLY FOR LOGGED-IN ASHA WORKER
===================================================== */

router.get("/", async (req, res) => {
  try {
    const workerId =
      getWorkerId(req);

    if (!workerId) {
      return res.status(401).json({
        success: false,
        message:
          "Unable to identify authenticated ASHA worker.",
      });
    }

    const followUps =
      await MotherFollowUp.find({
        ashaWorker: workerId,
      })
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
   ONLY IF MOTHER BELONGS TO LOGGED-IN WORKER
===================================================== */

router.get(
  "/mother/:motherId",
  async (req, res) => {
    try {
      const workerId =
        getWorkerId(req);

      if (!workerId) {
        return res.status(401).json({
          success: false,
          message:
            "Unable to identify authenticated ASHA worker.",
        });
      }

      const {
        motherId,
      } = req.params;

      /* -----------------------------------------------
         Verify mother ownership
      ------------------------------------------------ */

      const mother =
        await Mother.findOne({
          _id: motherId,
          ashaWorker: workerId,
        });

      if (!mother) {
        return res.status(404).json({
          success: false,
          message:
            "Mother not found or does not belong to this ASHA worker.",
        });
      }

      const followUps =
        await MotherFollowUp.find({
          motherId: mother._id,
          ashaWorker: workerId,
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
   ONLY FOR LOGGED-IN ASHA WORKER
===================================================== */

router.put(
  "/:id/complete",
  async (req, res) => {
    try {
      const workerId =
        getWorkerId(req);

      if (!workerId) {
        return res.status(401).json({
          success: false,
          message:
            "Unable to identify authenticated ASHA worker.",
        });
      }

      const followUp =
        await MotherFollowUp.findOneAndUpdate(
          {
            _id: req.params.id,
            ashaWorker: workerId,
          },
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
          message:
            "Follow-up not found or does not belong to this ASHA worker.",
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
   ONLY FOR LOGGED-IN ASHA WORKER
===================================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const workerId =
        getWorkerId(req);

      if (!workerId) {
        return res.status(401).json({
          success: false,
          message:
            "Unable to identify authenticated ASHA worker.",
        });
      }

      const followUp =
        await MotherFollowUp.findOneAndDelete({
          _id: req.params.id,
          ashaWorker: workerId,
        });

      if (!followUp) {
        return res.status(404).json({
          success: false,
          message:
            "Follow-up not found or does not belong to this ASHA worker.",
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