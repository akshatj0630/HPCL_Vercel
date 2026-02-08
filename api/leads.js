// leads.js
import { connectToDatabase } from "./mongo.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { db } = await connectToDatabase();
    if (!db) throw new Error("Database connection failed");

    const { leads } = req.body;
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: "No leads provided" });
    }

    // Batch insert to prevent memory/time limits
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      const result = await db.collection("leads").insertMany(batch);
      totalInserted += result.insertedCount;
    }

    res.status(200).json({ inserted: totalInserted });
  } catch (err) {
    console.error("❌ leads.js error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
