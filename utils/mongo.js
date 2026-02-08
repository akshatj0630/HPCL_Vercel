// mongo.js - Safe MongoDB connection for Vercel
import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToDatabase() {
  if (db) return { client, db };

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    db = client.db(process.env.DB_NAME || "hpcl_leads");

    console.log("✅ MongoDB connected");
    return { client, db };
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    return { client: null, db: null };
  }
}
