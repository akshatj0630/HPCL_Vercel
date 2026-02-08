import { MongoClient } from "mongodb";

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.MONGODB_DB);
  }
  return { db };
}

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { temperature, humidity } = req.body;
      const collection = db.collection("sensor_data");
      const result = await collection.insertOne({ temperature, humidity, timestamp: new Date() });
      res.status(200).json({ status: "success", saved: result });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const docs = await db.collection("sensor_data")
                           .find({})
                           .sort({ timestamp: -1 })
                           .limit(10)
                           .toArray();
      res.status(200).json(docs);
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
