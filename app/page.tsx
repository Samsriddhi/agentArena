"use client";

import { useState } from "react";
import SetupPanel from "@/components/SetupPanel";
import ArenaView from "@/components/ArenaView";
import ResultsView from "@/components/ResultsView";

type RoundResult = {
  question: string;
  agent1_response: string;
  agent2_response: string;
  A_score: number;
  B_score: number;
  reason: string;
};

type RunTestResponse = {
  rounds: RoundResult[];
  totals: {
    agent1: number;
    agent2: number;
  };
};

type ArenaForm = {
  judgeApiKey: string;
  judgeModel: string;
  judgeSystemPrompt: string;
  agent1ApiKey: string;
  agent1Model: string;
  agent1SystemPrompt: string;
  agent2ApiKey: string;
  agent2Model: string;
  agent2SystemPrompt: string;
  rounds: number;
};

const INITIAL_FORM: ArenaForm = {
  judgeApiKey: "",
  judgeModel: "gpt-4.1-mini",
  judgeSystemPrompt: "You are a strict evaluator focused on math accuracy.",
  agent1ApiKey: "",
  agent1Model: "gpt-4.1-mini",
  agent1SystemPrompt: "You are a precise and methodical math expert.",
  agent2ApiKey: "",
  agent2Model: "gpt-4.1-mini",
  agent2SystemPrompt: "You are a fast and creative math problem solver.",
  rounds: 3
};

export default function HomePage() {
  const [form, setForm] = useState<ArenaForm>(INITIAL_FORM);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAResponse, setCurrentAResponse] = useState("");
  const [currentBResponse, setCurrentBResponse] = useState("");
  const [currentAScore, setCurrentAScore] = useState<number | null>(null);
  const [currentBScore, setCurrentBScore] = useState<number | null>(null);
  const [currentReason, setCurrentReason] = useState("");
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [totalA, setTotalA] = useState(0);
  const [totalB, setTotalB] = useState(0);
  const [error, setError] = useState("");

  const setField = (field: keyof ArenaForm, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const runTest = async () => {
    if (isRunning) {
      return;
    }

    setError("");
    setIsRunning(true);
    setCurrentRound(0);
    setCurrentQuestion("");
    setCurrentAResponse("");
    setCurrentBResponse("");
    setCurrentAScore(null);
    setCurrentBScore(null);
    setCurrentReason("");
    setRoundResults([]);
    setTotalA(0);
    setTotalB(0);

    try {
      for (let round = 1; round <= form.rounds; round += 1) {
        setCurrentRound(round);
        setCurrentQuestion("Generating question...");
        setCurrentAResponse("Waiting for Agent 1...");
        setCurrentBResponse("Waiting for Agent 2...");
        setCurrentAScore(null);
        setCurrentBScore(null);
        setCurrentReason("Judge is evaluating...");

        const response = await fetch("/api/run-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            judge: {
              apiKey: form.judgeApiKey,
              model: form.judgeModel,
              systemPrompt: form.judgeSystemPrompt
            },
            agent1: {
              apiKey: form.agent1ApiKey,
              model: form.agent1Model,
              systemPrompt: form.agent1SystemPrompt
            },
            agent2: {
              apiKey: form.agent2ApiKey,
              model: form.agent2Model,
              systemPrompt: form.agent2SystemPrompt
            },
            config: {
              rounds: 1
            }
          })
        });

        const payload = (await response.json()) as RunTestResponse | { error?: string };
        if (!response.ok) {
          throw new Error(payload && "error" in payload ? payload.error || "Run failed." : "Run failed.");
        }

        const roundResult = (payload as RunTestResponse).rounds[0];
        if (!roundResult) {
          throw new Error("No round result returned from API.");
        }

        setCurrentQuestion(roundResult.question);
        setCurrentAResponse(roundResult.agent1_response);
        setCurrentBResponse(roundResult.agent2_response);
        setCurrentAScore(roundResult.A_score);
        setCurrentBScore(roundResult.B_score);
        setCurrentReason(roundResult.reason);
        setRoundResults((prev) => [...prev, roundResult]);
        setTotalA((prev) => prev + roundResult.A_score);
        setTotalB((prev) => prev + roundResult.B_score);
      }
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unexpected error while running test.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">Agent Playoff</h1>
        <p className="mt-1 text-sm text-slate-700">
          Compare two LLM agents with automated judging over multiple rounds.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <SetupPanel form={form} disabled={isRunning} onChange={setField} onRun={runTest} />
        <ArenaView
          isRunning={isRunning}
          currentRound={currentRound}
          totalRounds={form.rounds}
          currentQuestion={currentQuestion}
          agent1Response={currentAResponse}
          agent2Response={currentBResponse}
          aScore={currentAScore}
          bScore={currentBScore}
          reason={currentReason}
        />
      </section>

      <section className="mt-4">
        <ResultsView rounds={roundResults} totalA={totalA} totalB={totalB} />
      </section>
    </main>
  );
}
