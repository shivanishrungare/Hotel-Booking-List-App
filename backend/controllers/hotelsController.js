import db from "../db.js";

export const getHotels = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hotels");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

