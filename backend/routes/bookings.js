import express from "express";
import { getBookings, addBooking, getBookingById, updateBooking, cancelBooking, deleteBooking } from "../controllers/bookingsController.js";

const router = express.Router();

router.get("/", getBookings);
router.get("/:id", getBookingById); 
router.post("/create", addBooking);
router.put("/:id", updateBooking); 
router.put("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);



export default router;
