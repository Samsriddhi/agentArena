"use client";

type RoundResult = {
  question: string;
  agent1_response: string;
  agent2_response: string;
  A_score: number;
  B_score: number;
  reason: string;
};

type ResultsViewProps = {
  rounds: RoundResult[];
  totalA: number;
  totalB: number;
};

export default function ResultsView({ rounds, totalA, totalB }: ResultsViewProps) {
  if (rounds.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Results</h2>
        <p className="mt-2 text-sm text-slate-600">Run a test to see full round-by-round results.</p>
      </section>
    );
  }

  const winner =
    totalA === totalB ? "Tie" : totalA > totalB ? "Agent 1 wins" : "Agent 2 wins";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Results</h2>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded bg-slate-100 px-3 py-1 font-medium text-slate-700">Agent 1: {totalA}</span>
        <span className="rounded bg-slate-100 px-3 py-1 font-medium text-slate-700">Agent 2: {totalB}</span>
        <span
          className={`rounded px-3 py-1 font-semibold ${
            winner === "Tie" ? "bg-slate-200 text-slate-800" : "bg-green-100 text-green-800"
          }`}
        >
          {winner}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-700">
              <th className="px-2 py-2 font-semibold">Round</th>
              <th className="px-2 py-2 font-semibold">Question</th>
              <th className="px-2 py-2 font-semibold">A Score</th>
              <th className="px-2 py-2 font-semibold">B Score</th>
              <th className="px-2 py-2 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
              <tr key={`${index}-${round.A_score}-${round.B_score}`} className="border-b border-slate-100 align-top">
                <td className="px-2 py-2 text-slate-700">{index + 1}</td>
                <td className="max-w-xs px-2 py-2 whitespace-pre-wrap text-slate-700">{round.question}</td>
                <td className="px-2 py-2 font-semibold text-slate-800">{round.A_score}</td>
                <td className="px-2 py-2 font-semibold text-slate-800">{round.B_score}</td>
                <td className="max-w-sm px-2 py-2 whitespace-pre-wrap text-slate-700">{round.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
