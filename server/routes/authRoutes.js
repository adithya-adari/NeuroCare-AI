import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AshaWorker from "../models/AshaWorker.js";

const router = express.Router();

/* =====================================================
   ADMIN CREATE ASHA WORKER
===================================================== */

router.post("/admin/create-worker", async (req, res) => {
  try {
    const {
      adminSecret,
      name,
      email,
      password,
      village,
    } = req.body;

    if (
      !adminSecret ||
      adminSecret !==
        process.env.ADMIN_SECRET
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !name ||
      !email ||
      !password ||
      !village
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and village are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    const existingWorker =
      await AshaWorker.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingWorker) {
      return res.status(409).json({
        success: false,
        message:
          "An ASHA worker with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const worker =
      await AshaWorker.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        village: village.trim(),
      });

    res.status(201).json({
      success: true,
      message:
        "ASHA worker created successfully.",
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        village: worker.village,
      },
    });

  } catch (error) {
    console.error(
      "Create ASHA worker error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create ASHA worker.",
    });
  }
});

/* =====================================================
   ASHA LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const worker =
      await AshaWorker.findOne({
        email: email.toLowerCase().trim(),
      });

    if (!worker) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        worker.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is not configured.",
      });
    }

    const token =
      jwt.sign(
        {
          id: worker._id,
          email: worker.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.json({
      success: true,
      message:
        "Login successful.",
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        village: worker.village,
      },
    });

  } catch (error) {
    console.error(
      "ASHA login error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to login.",
    });
  }
});

export default router;