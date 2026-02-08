import { connectToDatabase } from "../utils/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { companies } = req.body;
    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const { db } = await connectToDatabase();
    const bulkOps = companies.map(c => ({
      updateOne: {
        filter: { canonical_name: c.canonical_name },
        update: { $set: c },
        upsert: true
      }
    }));

    const result = await db.collection("companies").bulkWrite(bulkOps);

    res.status(200).json({ status: "success", modifiedCount: result.modifiedCount, upsertedCount: result.upsertedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
