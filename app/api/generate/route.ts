import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { stationId, stationName, topic, hostName } = await request.json();

  if (!stationId || !stationName || !topic || !hostName) {
    return new Response("Missing required fields", { status: 400 });
  }

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    system: `あなたは${stationName}というラジオ番組のAIパーソナリティ、${hostName}です。
自然な日本語（です・ます調）でラジオDJのように話してください。
リスナーには「皆さん」と呼びかけてください。
挨拶を含め、トピックを魅力的に紹介してください。
500〜800文字程度でまとめてください。
HTMLや特殊文字は使わないでください。`,
    messages: [
      {
        role: "user",
        content: `本日の放送では「${topic}」についてお話しください。`,
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
