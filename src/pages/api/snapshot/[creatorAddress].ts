import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const apiKey = process.env.HELIOUS_API_KEY;

    const apiUrl = "https://mainnet.helius-rpc.com";

    const creatorAddress = req.query.creatorAddress as string;

    if (!creatorAddress) {
      return res.status(400).json({ error: "Creator address is required." });
    }

    const params = {
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByCreator",
      params: {
        creatorAddress,
        page: 1,
        limit: 1000,
      },
    };

    try {
      const response = await fetch(`${apiUrl}/?api-key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.result.items;

        return res.status(200).json(result);
      } else {
        const errorData = await response.text();
        return res.status(response.status).json({ error: errorData });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
