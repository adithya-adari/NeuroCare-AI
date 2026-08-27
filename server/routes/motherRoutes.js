import express from "express";
import Mother from "../models/Mother.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ALL MOTHER ROUTES REQUIRE ASHA AUTHENTICATION
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
   CREATE MOTHER
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

      /* Assign mother to logged-in ASHA worker */
      ashaWorker: workerId,
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

/* =====================================================
   GET MOTHERS BELONGING TO LOGGED-IN ASHA WORKER
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

    const mothers =
      await Mother.find({
        ashaWorker: workerId,
      })
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

/* =====================================================
   GET ONE MOTHER
   ONLY IF IT BELONGS TO LOGGED-IN WORKER
===================================================== */

router.get("/:id", async (req, res) => {
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

    const mother =
      await Mother.findOne({
        _id: req.params.id,
        ashaWorker: workerId,
      });

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

/* =====================================================
   UPDATE MOTHER
   ONLY IF IT BELONGS TO LOGGED-IN WORKER
===================================================== */

router.put("/:id", async (req, res) => {
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

    /*
     * Never allow the frontend to change ownership.
     * Only update normal mother fields.
     */

    const {
      name,
      age,
      mobile,
      village,
      pregnancyStatus,
      expectedDeliveryDate,
    } = req.body;

    const mother =
      await Mother.findOneAndUpdate(
        {
          _id: req.params.id,
          ashaWorker: workerId,
        },
        {
          name,
          age,
          mobile,
          village,
          pregnancyStatus,
          expectedDeliveryDate,
        },
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

/* =====================================================
   DELETE MOTHER
   ONLY IF IT BELONGS TO LOGGED-IN WORKER
===================================================== */

router.delete("/:id", async (req, res) => {
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

    const mother =
      await Mother.findOneAndDelete({
        _id: req.params.id,
        ashaWorker: workerId,
      });

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