"use client";

type ArenaForm = {
  judgeApiKey: string;
  judgeModel: string;
  agent1ApiKey: string;
  agent1Model: string;
  agent1SystemPrompt: string;
  agent2ApiKey: string;
  agent2Model: string;
  agent2SystemPrompt: string;
  rounds: number;
};

type SetupPanelProps = {
  form: ArenaForm;
  disabled: boolean;
  onChange: (field: keyof ArenaForm, value: string | number) => void;
  onRun: () => void;
};

function InputLabel({ text }: { text: string }) {
  return <span className="mb-1 block text-sm font-medium text-slate-700">{text}</span>;
}

export default function SetupPanel({ form, disabled, onChange, onRun }: SetupPanelProps) {
  return (
    <section className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Setup</h2>
      <p className="mt-1 text-sm text-slate-600">
        Configure judge and both agents, then run the arena.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <InputLabel text="Judge API Key" />
          <input
            type="password"
            value={form.judgeApiKey}
            onChange={(e) => onChange("judgeApiKey", e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
            placeholder="sk-..."
          />
        </div>

        <div>
          <InputLabel text="Judge Model" />
          <input
            type="text"
            value={form.judgeModel}
            onChange={(e) => onChange("judgeModel", e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
            placeholder="gpt-4.1-mini"
          />
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <h3 className="text-sm font-semibold text-slate-800">Agent 1</h3>
          <div className="mt-2 space-y-2">
            <div>
              <InputLabel text="API Key" />
              <input
                type="password"
                value={form.agent1ApiKey}
                onChange={(e) => onChange("agent1ApiKey", e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
                placeholder="sk-..."
              />
            </div>
            <div>
              <InputLabel text="Model" />
              <input
                type="text"
                value={form.agent1Model}
                onChange={(e) => onChange("agent1Model", e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
                placeholder="gpt-4.1-mini"
              />
            </div>
            <div>
              <InputLabel text="System Prompt" />
              <textarea
                value={form.agent1SystemPrompt}
                onChange={(e) => onChange("agent1SystemPrompt", e.target.value)}
                disabled={disabled}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
                placeholder="You are an expert math solver..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <h3 className="text-sm font-semibold text-slate-800">Agent 2</h3>
          <div className="mt-2 space-y-2">
            <div>
              <InputLabel text="API Key" />
              <input
                type="password"
                value={form.agent2ApiKey}
                onChange={(e) => onChange("agent2ApiKey", e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
                placeholder="sk-..."
              />
            </div>
            <div>
              <InputLabel text="Model" />
              <input
                type="text"
                value={form.agent2Model}
                onChange={(e) => onChange("agent2Model", e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
                placeholder="gpt-4.1-mini"
              />
            </div>
            <div>
              <InputLabel text="System Prompt" />
              <textarea
                value={form.agent2SystemPrompt}
                onChange={(e) => onChange("agent2SystemPrompt", e.target.value)}
                disabled={disabled}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
                placeholder="You are an efficient competition solver..."
              />
            </div>
          </div>
        </div>

        <div>
          <InputLabel text="Number of Rounds" />
          <input
            type="number"
            min={1}
            max={50}
            value={form.rounds}
            onChange={(e) => onChange("rounds", Number(e.target.value))}
            disabled={disabled}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-accent focus:ring"
          />
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={disabled}
          className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {disabled ? "Running..." : "Run Test"}
        </button>
      </div>
    </section>
  );
}
