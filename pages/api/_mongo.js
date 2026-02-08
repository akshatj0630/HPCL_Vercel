import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please add your MongoDB URI to VERCEL secrets");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("hpcl_db");

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}
