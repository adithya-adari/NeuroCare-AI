import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";
import motherRoutes from "./routes/motherRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors());
app.use(express.json());

/* -------------------- ROOT -------------------- */

app.get("/", (req, res) => {
  res.send("NeuroCare AI Backend Running");
});

/* -------------------- API ROUTES -------------------- */

app.use("/api/ai", aiRoutes);

app.use("/api/mothers", motherRoutes);

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
});