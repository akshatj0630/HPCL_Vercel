let companiesData = []; // In-memory storage

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { companies } = req.body;
    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    companiesData.push(...companies);
    return res.status(200).json({ status: "success", inserted: companies.length });
  }

  if (req.method === "GET") {
    return res.status(200).json({ companies: companiesData });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
