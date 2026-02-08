import { connectToDatabase } from "./_mongo.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const summary = req.body;
    const { db } = await connectToDatabase();
    const collection = db.collection("summary");

    await collection.updateOne(
      { _id: "latest_summary" },
      { $set: summary },
      { upsert: true }
    );

    res.status(200).json({ status: "success", message: "Summary saved" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
}
