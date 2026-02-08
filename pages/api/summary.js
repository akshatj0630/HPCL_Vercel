let summaryData = {}; // In-memory storage

export default async function handler(req, res) {
  if (req.method === "POST") {
    summaryData = req.body;
    return res.status(200).json({ status: "success" });
  }

  if (req.method === "GET") {
    return res.status(200).json(summaryData);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
