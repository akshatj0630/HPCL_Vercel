import { connectToDatabase } from '../../lib/mongodb';
import { validateSummary } from '../../lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const summary = req.body;

    validateSummary(summary);

    const { db } = await connectToDatabase();

    const result = await db.collection('summary').updateOne(
      { _id: 'latest' },
      { 
        $set: { 
          ...summary,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Summary updated successfully',
      upserted: result.upsertedId ? true : false
    });

  } catch (error) {
    console.error('Summary API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
