import { callLLM } from "@/lib/llm";

export type JudgeConfig = {
  apiKey: string;
  model: string;
  systemPrompt?: string;
};

export type AgentConfig = {
  apiKey: string;
  model: string;
  systemPrompt: string;
};

export type ArenaConfig = {
  rounds: number;
};

export type RunTestRequest = {
  judge: JudgeConfig;
  agent1: AgentConfig;
  agent2: AgentConfig;
  config: ArenaConfig;
};

export type RoundResult = {
  question: string;
  agent1_response: string;
  agent2_response: string;
  A_score: number;
  B_score: number;
  reason: string;
};

export type RunTestResponse = {
  rounds: RoundResult[];
  totals: {
    agent1: number;
    agent2: number;
  };
};

type EvaluationResult = {
  A_score: number;
  B_score: number;
  reason: string;
};

function parseEvaluationJson(input: string): EvaluationResult {
  try {
    const direct = JSON.parse(input) as EvaluationResult;
    if (
      Number.isFinite(direct.A_score) &&
      Number.isFinite(direct.B_score) &&
      typeof direct.reason === "string"
    ) {
      return {
        A_score: Number(direct.A_score),
        B_score: Number(direct.B_score),
        reason: direct.reason.trim()
      };
    }
  } catch {
    // Continue to extraction fallback.
  }

  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = input.slice(start, end + 1);
    const parsed = JSON.parse(candidate) as EvaluationResult;
    if (
      Number.isFinite(parsed.A_score) &&
      Number.isFinite(parsed.B_score) &&
      typeof parsed.reason === "string"
    ) {
      return {
        A_score: Number(parsed.A_score),
        B_score: Number(parsed.B_score),
        reason: parsed.reason.trim()
      };
    }
  }

  throw new Error("Judge returned invalid evaluation JSON.");
}

export async function runAgent(agent: AgentConfig, input: string): Promise<string> {
  return callLLM({
    apiKey: agent.apiKey,
    model: agent.model,
    system: agent.systemPrompt,
    user: input
  });
}

export async function generateQuestion(judge: JudgeConfig): Promise<string> {
  return callLLM({
    apiKey: judge.apiKey,
    model: judge.model,
    system: "You are a math question generator.",
    user: "Generate ONE challenging math problem. No explanation."
  });
}

export async function evaluate(
  judge: JudgeConfig,
  prompt: string,
  res1: string,
  res2: string
): Promise<EvaluationResult> {
  const evaluationText = await callLLM({
    apiKey: judge.apiKey,
    model: judge.model,
    system: judge.systemPrompt?.trim() || "You are a strict evaluator.",
    user: [
      "Evaluate these two answers to the same math problem.",
      "Return STRICT JSON only.",
      "",
      `Problem: ${prompt}`,
      "",
      `Answer A: ${res1}`,
      "",
      `Answer B: ${res2}`,
      "",
      'Format exactly as: {"A_score": number, "B_score": number, "reason": string}'
    ].join("\n")
  });

  return parseEvaluationJson(evaluationText);
}

function validateRequestBody(input: RunTestRequest): RunTestRequest {
  const rounds = Number(input?.config?.rounds);
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > 50) {
    throw new Error("config.rounds must be an integer between 1 and 50.");
  }

  if (!input.judge?.apiKey || !input.judge?.model) {
    throw new Error("Judge API key and model are required.");
  }
  if (!input.agent1?.apiKey || !input.agent1?.model) {
    throw new Error("Agent 1 API key and model are required.");
  }
  if (!input.agent2?.apiKey || !input.agent2?.model) {
    throw new Error("Agent 2 API key and model are required.");
  }

  return {
    judge: {
      apiKey: input.judge.apiKey.trim(),
      model: input.judge.model.trim(),
      systemPrompt: input.judge.systemPrompt ?? ""
    },
    agent1: {
      apiKey: input.agent1.apiKey.trim(),
      model: input.agent1.model.trim(),
      systemPrompt: input.agent1.systemPrompt ?? ""
    },
    agent2: {
      apiKey: input.agent2.apiKey.trim(),
      model: input.agent2.model.trim(),
      systemPrompt: input.agent2.systemPrompt ?? ""
    },
    config: {
      rounds
    }
  };
}

export async function runArenaTest(body: RunTestRequest): Promise<RunTestResponse> {
  const input = validateRequestBody(body);
  const results: RoundResult[] = [];
  let agent1Total = 0;
  let agent2Total = 0;

  for (let i = 0; i < input.config.rounds; i += 1) {
    const question = await generateQuestion(input.judge);
    const [agent1Response, agent2Response] = await Promise.all([
      runAgent(input.agent1, question),
      runAgent(input.agent2, question)
    ]);

    const judged = await evaluate(input.judge, question, agent1Response, agent2Response);

    agent1Total += judged.A_score;
    agent2Total += judged.B_score;

    results.push({
      question,
      agent1_response: agent1Response,
      agent2_response: agent2Response,
      A_score: judged.A_score,
      B_score: judged.B_score,
      reason: judged.reason
    });
  }

  return {
    rounds: results,
    totals: {
      agent1: agent1Total,
      agent2: agent2Total
    }
  };
}
