import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const { message, stationName, hostName, history } = await request.json();

  if (!message || !stationName || !hostName) {
    return new Response("Missing required fields", { status: 400 });
  }

  const historyMessages: HistoryMessage[] = Array.isArray(history)
    ? history
    : [];

  const messages: Anthropic.MessageParam[] = [
    ...historyMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: `あなたは${stationName}のAI DJ、${hostName}です。
日本語（です・ます調）で返答してください。
答えは短く（2〜4文程度）、フレンドリーで明るい雰囲気で話してください。`,
    messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
