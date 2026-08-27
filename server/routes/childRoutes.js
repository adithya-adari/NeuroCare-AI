import express from "express";
import Child from "../models/Child.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ALL CHILD ROUTES REQUIRE ASHA AUTHENTICATION
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
   CREATE CHILD
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

      /* Assign child to logged-in ASHA worker */
      ashaWorker: workerId,
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

/* =====================================================
   GET CHILDREN BELONGING TO LOGGED-IN ASHA WORKER
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

    const children =
      await Child.find({
        ashaWorker: workerId,
      }).sort({
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

/* =====================================================
   GET ONE CHILD
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

    const child =
      await Child.findOne({
        _id: req.params.id,
        ashaWorker: workerId,
      });

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

/* =====================================================
   UPDATE CHILD
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
     * Only update normal child fields.
     * Do not allow frontend to change ashaWorker.
     */

    const {
      name,
      dateOfBirth,
      gender,
      motherName,
      village,
    } = req.body;

    const child =
      await Child.findOneAndUpdate(
        {
          _id: req.params.id,
          ashaWorker: workerId,
        },
        {
          name,
          dateOfBirth,
          gender,
          motherName,
          village,
        },
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

/* =====================================================
   DELETE CHILD
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

    const child =
      await Child.findOneAndDelete({
        _id: req.params.id,
        ashaWorker: workerId,
      });

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