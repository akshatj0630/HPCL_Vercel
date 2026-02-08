import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const db = await connectToDatabase();
    const { companies } = req.body;

    const result = await db.collection('companies').insertMany(companies, {
      ordered: false
    });

    console.log(`✅ Inserted ${result.insertedCount} companies`);
    res.status(200).json({ 
      success: true, 
      inserted: result.insertedCount 
    });
  } catch (error) {
    console.error('Companies error:', error);
    res.status(500).json({ error: 'Failed to save companies' });
  }
}
