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
      const leads = await db.collection("leads").find({}).toArray();
      res.status(200).json({ leads });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  } else if (req.method === "POST") {
    try {
      const { leads } = req.body;
      if (!leads || !Array.isArray(leads)) {
        return res.status(400).json({ error: "Invalid payload" });
      }

      await db.collection("leads").insertMany(leads);
      res.status(200).json({ message: "Leads saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save leads" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
