import { connectToDatabase } from "../utils/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const summary = req.body;
    if (!summary || typeof summary !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const { db } = await connectToDatabase();
    await db.collection("summary").insertOne({ ...summary, created_at: new Date() });

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
