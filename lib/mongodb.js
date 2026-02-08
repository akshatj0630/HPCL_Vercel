import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'hpcl';

if (!uri) {
  throw new Error('Please define MONGODB_URI in your environment variables');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // Use global variable to preserve connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, use a single connection (Vercel will reuse it across invocations)
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    clientPromise = client.connect();
  }
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    return { db, client };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// In serverless environments like Vercel, **do not close the connection after every request**
// export async function closeDatabaseConnection() {
//   if (client) await client.close();
// }
