# Agent Playoff / Oneoff Overall

Agent Playoff / Oneoff Overall is a Next.js MVP that compares two LLM agents using a judge LLM over multiple rounds.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Next.js API Route backend (`/pages/api/run-test.ts`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

`http://localhost:3000`

## Where to paste API keys

In the left **Setup** panel on the home page:

- Judge API key
- Agent 1 API key
- Agent 2 API key

All keys are used only during the request lifecycle and are never stored server-side.

## How to run a comparison

1. Enter judge model and both agent models.
2. Enter system prompts for Agent 1 and Agent 2.
3. Enter number of rounds.
4. Click **Run Test**.

The app will:

1. Generate a math question with the judge.
2. Get responses from both agents.
3. Ask the judge to score both.
4. Repeat for the configured rounds.

After completion, the bottom Results section shows all rounds, total scores, and winner.

## API Contract

`POST /api/run-test`

Request body:

```json
{
  "judge": { "apiKey": "string", "model": "string" },
  "agent1": { "apiKey": "string", "model": "string", "systemPrompt": "string" },
  "agent2": { "apiKey": "string", "model": "string", "systemPrompt": "string" },
  "config": { "rounds": 3 }
}
```

Response body:

```json
{
  "rounds": [
    {
      "question": "string",
      "agent1_response": "string",
      "agent2_response": "string",
      "A_score": 7,
      "B_score": 8,
      "reason": "string"
    }
  ],
  "totals": {
    "agent1": 7,
    "agent2": 8
  }
}
```
