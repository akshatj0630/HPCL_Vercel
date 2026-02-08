import { MongoClient } from "mongodb";

let client;
let db;

const MONGO_URI = process.env.MONGO_URI; // Set in Vercel dashboard
const DB_NAME = process.env.DB_NAME || "hpcl";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside Vercel");
}

export async function connectToDatabase() {
  if (db) return { client, db };

  client = new MongoClient(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });

  await client.connect();
  db = client.db(DB_NAME);
  console.log("✅ MongoDB connected");
  return { client, db };
}
