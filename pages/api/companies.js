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

  if (req.method === "GET") {
    try {
      const companies = await db.collection("companies").find({}).toArray();
      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  } else if (req.method === "POST") {
    try {
      const { companies } = req.body;
      if (!companies || !Array.isArray(companies)) {
        return res.status(400).json({ error: "Invalid payload" });
      }

      await db.collection("companies").insertMany(companies);
      res.status(200).json({ message: "Companies saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save companies" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
