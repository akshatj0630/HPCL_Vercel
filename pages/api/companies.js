import { connectToDatabase } from "./_mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { companies } = req.body;
    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({ error: "No companies provided" });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("companies");

    const ops = companies.map(company => ({
      updateOne: {
        filter: { canonical_name: company.canonical_name },
        update: { $set: company },
        upsert: true
      }
    }));

    const result = await collection.bulkWrite(ops);
    res.status(200).json({ status: "success", modifiedCount: result.modifiedCount, upsertedCount: result.upsertedCount });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
}
