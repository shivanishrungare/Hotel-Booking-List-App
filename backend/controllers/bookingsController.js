import dayjs from "dayjs";
import db from "../db.js"

export const getBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, h.hotel_name
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.hotel_id
    `);

    const formattedRows = rows.map((r) => ({
      ...r,
      booking_date: r.booking_date ? dayjs(r.booking_date).format("YYYY-MM-DD") : null,
      arrival_date: r.arrival_date ? dayjs(r.arrival_date).format("YYYY-MM-DD") : null,
      departure_date: r.departure_date ? dayjs(r.departure_date).format("YYYY-MM-DD") : null,
      cancelled_date: r.cancelled_date ? dayjs(r.cancelled_date).format("YYYY-MM-DD") : null,
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
// export const addBooking = async (req, res) => {
//   const {
//     booking_id,
//     hotel_id,
//     booking_date,
//     source,
//     value,
//     arrival_date,
//     departure_date,
//     cancelled_date,
//     refund_value,
//     status,
//   } = req.body;

//   try {
//     // ✅ Fix: Correct number of placeholders
//     const [result] = await db.query(
//       `INSERT INTO bookings 
//         (booking_id, hotel_id, booking_date, source, value, arrival_date, departure_date, cancelled_date, refund_value, status)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         booking_id,
//         hotel_id,
//         booking_date,
//         source,
//         value,
//         arrival_date,
//         departure_date,
//         cancelled_date || null,
//         refund_value || 0,
//         status,
//       ]
//     );

//     // ✅ Get the inserted booking with hotel name
//     const [rows] = await db.query(
//       `SELECT b.*, h.hotel_name 
//        FROM bookings b
//        JOIN hotels h ON b.hotel_id = h.hotel_id
//        WHERE b.booking_id = ?`,
//       [booking_id]
//     );

//     res.status(201).json(rows[0]); // return new booking to frontend
//   } catch (err) {
//     console.error("Error inserting booking:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
