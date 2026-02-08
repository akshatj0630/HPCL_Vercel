export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log("Received companies:", data);
    // Here you could store in MongoDB
    res.status(200).json({ status: 'success', received: data.companies.length });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
