import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import hotelsRoutes from "./routes/hotels.js";
import bookingsRoutes from "./routes/bookings.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/hotels", hotelsRoutes);
app.use("/api/bookings", bookingsRoutes);


app.get("/", (req, res) => {
  res.send("Hotel Booking API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

