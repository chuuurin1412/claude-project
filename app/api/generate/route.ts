import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { stationId, stationName, topic, hostName, userInterests } =
    await request.json();

  if (!stationId || !stationName || !topic || !hostName) {
    return new Response("Missing required fields", { status: 400 });
  }

  const interestLine =
    Array.isArray(userInterests) && userInterests.length > 0
      ? `\nリスナーの関心: ${userInterests.join(「、」)}—この視点から角度を選ぶこと。`
      : "";

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: `あなたは${stationName}のAIパーソナリティ、${hostName}です。

【絶対ルール】
・200～350文字と簡潔にまとめること
・表面的な事実の羅列ではなく、「なぜ重要か」「何が変わるか」「本質は何か」を深掘りする
・構成: ①インパクトのある一言 → ②核心の洞察 → ③リスナーへの示唠
・ラジギDJらしい話し言葉（です・ます調）
・HTML・記号（**など）は絶対使わない${interestLine}`,
    messages: [
      {
        role: "user",
        content: `「${topic}」について本日の放送をお願いします。`,
      },
    ],
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
