import { MongoClient } from "mongodb";

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.MONGODB_DB);
  }
  return db;
}

export default async function handler(req, res) {
  const database = await connectToDatabase();

  if (req.method === "POST") {
    const { leads } = req.body;
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    try {
      await database.collection("leads").insertMany(leads);
      return res.status(200).json({ status: "success", inserted: leads.length });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  }

  if (req.method === "GET") {
    const allLeads = await database.collection("leads").find({}).toArray();
    return res.status(200).json({ leads: allLeads });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
