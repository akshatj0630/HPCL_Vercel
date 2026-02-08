import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const db = await connectToDatabase();
    const summary = req.body;

    await db.collection('summary').deleteOne({ _id: 'latest' });
    await db.collection('summary').insertOne({
      ...summary,
      _id: 'latest',
      timestamp: new Date()
    });

    console.log('✅ Summary saved');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to save summary' });
  }
}
