export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log("Received leads batch:", data);
    // Save to DB here
    res.status(200).json({ status: 'success', received: data.leads.length });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
