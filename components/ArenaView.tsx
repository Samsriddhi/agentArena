"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

type ArenaViewProps = {
  isRunning: boolean;
  currentRound: number;
  totalRounds: number;
  currentQuestion: string;
  agent1Response: string;
  agent2Response: string;
  aScore: number | null;
  bScore: number | null;
  reason: string;
};

function ResponseCard({
  title,
  content
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">{title}</div>
      <div className="h-72 overflow-y-auto px-3 py-3 text-sm text-slate-800">
        <div className="[&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-slate-800 [&_pre]:p-2 [&_pre]:text-slate-100 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {normalizeMathDelimiters(content || "No response yet.")}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function normalizeMathDelimiters(input: string): string {
  return input
    .replace(/\\\[(.*?)\\\]/gs, "$$$1$$")
    .replace(/\\\((.*?)\\\)/gs, "$$1$");
}

export default function ArenaView({
  isRunning,
  currentRound,
  totalRounds,
  currentQuestion,
  agent1Response,
  agent2Response,
  aScore,
  bScore,
  reason
}: ArenaViewProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Arena View</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isRunning ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {isRunning ? "Running" : "Idle"}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-sm font-medium text-slate-700">
          Current round: {currentRound > 0 ? `${currentRound}/${totalRounds}` : `0/${totalRounds || 0}`}
        </p>
        <div className="mt-1 text-sm text-slate-800 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {normalizeMathDelimiters(
              currentQuestion || (isRunning ? "Generating question..." : "No question yet.")
            )}
          </ReactMarkdown>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResponseCard title="Agent 1 Response" content={agent1Response} />
        <ResponseCard title="Agent 2 Response" content={agent2Response} />
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-700">Judge Output</p>
        <p className="mt-2 text-sm text-slate-800">
          Agent 1 Score: {aScore ?? "-"} | Agent 2 Score: {bScore ?? "-"}
        </p>
        <div className="mt-2 text-sm text-slate-700 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {normalizeMathDelimiters(reason || (isRunning ? "Awaiting evaluation..." : "No evaluation yet."))}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
