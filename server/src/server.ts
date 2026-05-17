import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();

connectDB();

const app = express();

// MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

// ROUTES AFTER MIDDLEWARE
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.send("GigFlow API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});