import db from "../db.js";

export const getHotels = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hotels");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addHotel = async (req, res) => {
  const { hotel_name, location, rating, contact_email } = req.body;
  try {
    await db.query(
      "INSERT INTO hotels (hotel_name, location, rating, contact_email) VALUES (?, ?, ?, ?)",
      [hotel_name, location, rating, contact_email]
    );
    res.status(201).json({ message: "Hotel added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
