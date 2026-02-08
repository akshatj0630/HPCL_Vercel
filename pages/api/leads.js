let leadsData = []; // In-memory storage

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { leads } = req.body;
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    leadsData.push(...leads);
    return res.status(200).json({ status: "success", inserted: leads.length });
  }

  if (req.method === "GET") {
    return res.status(200).json({ leads: leadsData });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
