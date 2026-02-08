// summary.js
import { connectToDatabase } from "./mongo.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { db } = await connectToDatabase();
    if (!db) throw new Error("Database connection failed");

    const { summary } = req.body;
    if (!summary || typeof summary !== "object") {
      return res.status(400).json({ error: "Invalid summary payload" });
    }

    const result = await db.collection("summary").insertOne(summary);
    res.status(200).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error("❌ summary.js error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
