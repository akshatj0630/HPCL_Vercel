import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const ping = await db.admin().ping();
    
    res.status(200).json({ 
      status: 'healthy', 
      mongodb: ping.ok === 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
}
