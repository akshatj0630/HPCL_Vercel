import { connectToDatabase } from "./_mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { leads } = req.body;
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: "No leads provided" });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("leads");

    const ops = leads.map(lead => ({
      updateOne: {
        filter: { lead_id: lead.lead_id },
        update: { $set: lead },
        upsert: true
      }
    }));

    const result = await collection.bulkWrite(ops);
    res.status(200).json({ status: "success", modifiedCount: result.modifiedCount, upsertedCount: result.upsertedCount });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
}
