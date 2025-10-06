// routes/hotels.js
import express from "express";
import { getHotels, addHotel } from "../controllers/hotelsController.js";

const router = express.Router();

router.get("/", getHotels);
router.post("/create", addHotel);

export default router;
