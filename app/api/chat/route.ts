import { createGateway } from "@ai-sdk/gateway";
import { streamObject } from "ai";
import { checkBotId } from "botid/server";
import * as cheerio from "cheerio";

const gateway = createGateway({
  baseURL: "https://ai-gateway.vercel.sh/v1/ai",
});

export async function POST(req: Request) {
  const { isBot } = await checkBotId();
  if (isBot) {
    return new Response("Access denied", { status: 403 });
  }

  const { prompt, source }: { prompt: string; source: string } =
    await req.json();

  if (!source.startsWith("https://en.wikipedia.org/wiki/")) {
    throw new Error("Invalid source URL");
  }

  const content = await fetch(source);

  const text = await content.text();
  const $ = cheerio.load(text);
  $("script").remove();
  $("style").remove();
  const strippedText = $("body").text().trim();
  const cleanText = strippedText.replace(/\s+/g, " ");

  const result = await streamObject({
    model: gateway("openai/gpt-4o"),
    system: `\
      - for the following webpage, generate a JSON schema based on the user prompt
      - use camelCase for keys

      ${cleanText}
    `,
    prompt,
    output: "no-schema",
    onFinish({ object }) {
      // save object to database
    },
  });

  return result.toTextStreamResponse();
}
