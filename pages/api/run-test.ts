import type { NextApiRequest, NextApiResponse } from "next";
import { runArenaTest, type RunTestRequest, type RunTestResponse } from "@/lib/orchestrator";

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RunTestResponse | ErrorResponse>
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = req.body as RunTestRequest;
    const result = await runArenaTest(body);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    res.status(400).json({ error: message });
  }
}
