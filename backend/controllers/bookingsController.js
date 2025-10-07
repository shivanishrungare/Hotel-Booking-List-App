import dayjs from "dayjs";
import db from "../db.js";

export const getBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, h.hotel_name
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.hotel_id
    `);

    const formattedRows = rows.map((r) => ({
      ...r,
      booking_date: r.booking_date
        ? dayjs(r.booking_date).format("YYYY-MM-DD")
        : null,
      arrival_date: r.arrival_date
        ? dayjs(r.arrival_date).format("YYYY-MM-DD")
        : null,
      departure_date: r.departure_date
        ? dayjs(r.departure_date).format("YYYY-MM-DD")
        : null,
      cancelled_date: r.cancelled_date
        ? dayjs(r.cancelled_date).format("YYYY-MM-DD")
        : null,
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const addBooking = async (req, res) => {
  const {
    hotel_id,
    booking_date,
    source,
    value,
    arrival_date,
    departure_date,
    cancelled_date,
    refund_value,
    status,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO bookings 
        ( hotel_id, booking_date, source, value, arrival_date, departure_date, cancelled_date, refund_value, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hotel_id,
        booking_date,
        source,
        value,
        arrival_date,
        departure_date,
        cancelled_date || null,
        refund_value || 0,
        status,
      ]
    );

    res.status(201).json({ message: "Booking added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const {
    hotel_id,
    booking_date,
    source,
    value,
    arrival_date,
    departure_date,
    cancelled_date,
    refund_value,
    status,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE bookings 
       SET hotel_id = ?, 
           booking_date = ?, 
           source = ?, 
           value = ?, 
           arrival_date = ?, 
           departure_date = ?,
           cancelled_date =?, 
           refund_value =?, 
           status = ?
       WHERE booking_id = ?`,
      [
        hotel_id,
        booking_date,
        source,
        value,
        arrival_date,
        departure_date,
        cancelled_date || null,
        refund_value || 0,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully" });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const { cancelled_date, value, refund_value, status } = req.body;

  try {
    if (!cancelled_date) {
      return res.status(400).json({ message: "Cancelled date is required" });
    }

    const [result] = await db.query(
      `UPDATE bookings
       SET status = ?, cancelled_date = ?, refund_value = ?
       WHERE booking_id = ?`,
      [status || "cancelled", cancelled_date, refund_value ?? 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking cancelled successfully",
      booking_id: id,
      cancelled_date,
      refund_value: refund_value ?? 0,
      status: status || "cancelled",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const [result] = await db.query(
      `DELETE FROM bookings WHERE booking_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully", booking_id: id });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Server error while deleting booking" });
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT b.*, h.hotel_name
       FROM bookings b
       JOIN hotels h ON b.hotel_id = h.hotel_id
       WHERE b.booking_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const r = rows[0];
    const formatted = {
      ...r,
      booking_date: r.booking_date
        ? dayjs(r.booking_date).format("YYYY-MM-DD")
        : null,
      arrival_date: r.arrival_date
        ? dayjs(r.arrival_date).format("YYYY-MM-DD")
        : null,
      departure_date: r.departure_date
        ? dayjs(r.departure_date).format("YYYY-MM-DD")
        : null,
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
