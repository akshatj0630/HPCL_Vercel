import { connectToDatabase } from '../../lib/mongodb';
import { validateLead } from '../../lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leads } = req.body;

    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: 'Invalid input: leads array required' });
    }

    const { db } = await connectToDatabase();

    // Validate all leads
    for (const lead of leads) {
      validateLead(lead);
    }

    // Create indexes for better performance
    await db.collection('leads').createIndex({ lead_id: 1 }, { unique: true });
    await db.collection('leads').createIndex({ company_name: 1 });
    await db.collection('leads').createIndex({ lead_score: -1 });
    await db.collection('leads').createIndex({ territory: 1 });
    await db.collection('leads').createIndex({ urgency_level: 1 });

    // Upsert leads
    const operations = leads.map(lead => ({
      updateOne: {
        filter: { lead_id: lead.lead_id },
        update: { 
          $set: { 
            ...lead,
            updated_at: new Date(),
            processed_at: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await db.collection('leads').bulkWrite(operations, { ordered: false });
    
    res.status(200).json({
      success: true,
      message: `Processed ${leads.length} leads`,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount
    });

  } catch (error) {
    console.error('Leads API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
