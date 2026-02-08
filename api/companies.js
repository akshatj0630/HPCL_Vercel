import { connectToDatabase } from '../../lib/mongodb';
import { validateCompanyProfile } from '../../lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companies } = req.body;

    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({ error: 'Invalid input: companies array required' });
    }

    const { db } = await connectToDatabase();

    // Validate all companies
    for (const company of companies) {
      validateCompanyProfile(company);
    }

    // Upsert companies (update if exists, insert if new)
    const operations = companies.map(company => ({
      updateOne: {
        filter: { canonical_name: company.canonical_name },
        update: { 
          $set: { 
            ...company,
            updated_at: new Date(),
            processed_at: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await db.collection('companies').bulkWrite(operations, { ordered: false });
    
    res.status(200).json({
      success: true,
      message: `Processed ${companies.length} companies`,
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount
    });

  } catch (error) {
    console.error('Companies API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
