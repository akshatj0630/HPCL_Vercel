import { connectToDatabase } from "../utils/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { leads } = req.body;
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const { db } = await connectToDatabase();
    const bulkOps = leads.map(l => ({
      updateOne: {
        filter: { lead_id: l.lead_id },
        update: { $set: l },
        upsert: true
      }
    }));

    const result = await db.collection("leads").bulkWrite(bulkOps);

    res.status(200).json({ status: "success", modifiedCount: result.modifiedCount, upsertedCount: result.upsertedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
