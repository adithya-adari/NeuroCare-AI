import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";
import motherRoutes from "./routes/motherRoutes.js";
import childRoutes from "./routes/childRoutes.js";

import childFollowUpRoutes from "./routes/childFollowUpRoutes.js";
import motherFollowUpRoutes from "./routes/motherFollowUpRoutes.js";

import authRoutes from "./routes/authRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());
app.use(express.json());

/* =====================================================
   ROOT
===================================================== */

app.get("/", (req, res) => {
  res.send("NeuroCare AI Backend Running");
});

/* =====================================================
   API ROUTES
===================================================== */

/* AI */

app.use("/api/ai", aiRoutes);

/* Mothers */

app.use("/api/mothers", motherRoutes);

/* Children */

app.use("/api/children", childRoutes);

/* Child Follow-ups */

app.use(
  "/api/child-followups",
  childFollowUpRoutes
);

/* Mother Follow-ups */

app.use(
  "/api/mother-followups",
  motherFollowUpRoutes
);

/* ASHA Authentication */

app.use(
  "/api/auth",
  authRoutes
);

/* =====================================================
   SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log(
      "Trying to connect to MongoDB..."
    );

    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();