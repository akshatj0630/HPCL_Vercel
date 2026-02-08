import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const db = await connectToDatabase();
    const { leads } = req.body;

    const result = await db.collection('leads').insertMany(leads, {
      ordered: false
    });

    console.log(`✅ Inserted ${result.insertedCount} leads`);
    res.status(200).json({ 
      success: true, 
      inserted: result.insertedCount 
    });
  } catch (error) {
    console.error('Leads error:', error);
    res.status(500).json({ error: 'Failed to save leads' });
  }
}
