// companies.js
import { connectToDatabase } from "./mongo.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { db } = await connectToDatabase();
    if (!db) throw new Error("Database connection failed");

    const { companies } = req.body;
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      return res.status(400).json({ error: "No companies provided" });
    }

    const result = await db.collection("companies").insertMany(companies);
    res.status(200).json({ inserted: result.insertedCount });
  } catch (err) {
    console.error("❌ companies.js error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
