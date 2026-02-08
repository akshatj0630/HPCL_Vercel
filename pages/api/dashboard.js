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
    const leads = await db.collection("leads").find({}).sort({ lead_score: -1 }).limit(50).toArray();
    const topProducts = await db.collection("leads").aggregate([
      { $group: { _id: "$product_rec_1_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    res.status(200).json({
      leads,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}
