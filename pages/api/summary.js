import { MongoClient } from "mongodb";

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.MONGODB_DB);
  }
  return { db, client };
}

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  try {
    const totalLeads = await db.collection("leads").countDocuments();
    const highGradeLeads = await db.collection("leads").countDocuments({ grade: { $in: ["A","B"] } });
    const urgentLeads = await db.collection("leads").countDocuments({ urgency: "Critical" });

    res.status(200).json({
      summary: {
        totalLeads,
        highGradeLeads,
        urgentLeads
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
}
