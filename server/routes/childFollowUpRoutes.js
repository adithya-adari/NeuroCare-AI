import express from "express";
import ChildFollowUp from "../models/ChildFollowUp.js";
import Child from "../models/Child.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ALL CHILD FOLLOW-UP ROUTES REQUIRE AUTHENTICATION
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
   CREATE CHILD FOLLOW-UP
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

    /* -----------------------------------------------
       Only allow follow-up for a child belonging
       to the logged-in ASHA worker.
    ------------------------------------------------ */

    const child =
      await Child.findOne({
        _id: childId,
        ashaWorker: workerId,
      });

    if (!child) {
      return res.status(404).json({
        success: false,
        message:
          "Child not found or does not belong to this ASHA worker.",
      });
    }

    const followUp =
      await ChildFollowUp.create({
        childId: child._id,
        childName: child.name,
        date,
        note,
        status: "Pending",
        ashaWorker: workerId,
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
      await ChildFollowUp.find({
        ashaWorker: workerId,
      })
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
   ONLY IF CHILD BELONGS TO LOGGED-IN WORKER
===================================================== */

router.get(
  "/child/:childId",
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
        childId,
      } = req.params;

      /* -----------------------------------------------
         Verify child ownership
      ------------------------------------------------ */

      const child =
        await Child.findOne({
          _id: childId,
          ashaWorker: workerId,
        });

      if (!child) {
        return res.status(404).json({
          success: false,
          message:
            "Child not found or does not belong to this ASHA worker.",
        });
      }

      const followUps =
        await ChildFollowUp.find({
          childId: child._id,
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
        await ChildFollowUp.findOneAndUpdate(
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
        await ChildFollowUp.findOneAndDelete({
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
          "Child follow-up deleted successfully.",
      });

    } catch (error) {
      console.error(
        "Delete child follow-up error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to delete child follow-up.",
      });
    }
  }
);

export default router;