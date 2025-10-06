// routes/bookings.js
import express from "express";
import { getBookings, addBooking } from "../controllers/bookingsController.js";

const router = express.Router();

router.get("/", getBookings);
router.post("/create", addBooking);

export default router;
