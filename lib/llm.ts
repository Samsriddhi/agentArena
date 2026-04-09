type CallLLMInput = {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  baseUrl?: string;
};

function readContent(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (
          typeof part === "object" &&
          part !== null &&
          "type" in part &&
          "text" in part &&
          (part as { type: string }).type === "text"
        ) {
          return String((part as { text: unknown }).text ?? "");
        }
        return "";
      })
      .join("\n");
    return text.trim();
  }

  return "";
}

export async function callLLM({
  apiKey,
  model,
  system,
  user,
  baseUrl
}: CallLLMInput): Promise<string> {
  if (!apiKey || !model) {
    throw new Error("Missing API key or model.");
  }

  const endpoint = `${(baseUrl ?? "https://api.openai.com/v1").replace(/\/$/, "")}/chat/completions`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  if (!response.ok) {
    let detail = "LLM API request failed.";
    try {
      const err = (await response.json()) as {
        error?: { message?: string };
      };
      if (err?.error?.message) {
        detail = err.error.message;
      }
    } catch {
      detail = `${detail} Status: ${response.status}.`;
    }
    throw new Error(detail);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const text = readContent(data?.choices?.[0]?.message?.content);
  if (!text) {
    throw new Error("LLM returned an empty response.");
  }

  return text;
}
