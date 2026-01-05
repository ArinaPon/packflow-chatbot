// app/(chat)/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage =
      messages && messages.length > 0
        ? messages[messages.length - 1].content
        : "Hello";

    // === NEW PART: read all .txt files inside /data ===
    const dataDir = path.join(process.cwd(), "data");
    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".txt"));
    let context = "";

    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), "utf8");

      // optional relevance filter: include only text if it roughly matches the user message
      if (
        content.toLowerCase().includes("conveyor") ||
        content.toLowerCase().includes(lastUserMessage.toLowerCase())
      ) {
        context += `\n\n--- from ${file} ---\n${content}`;
      }
    }

    // === END OF NEW PART ===

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are PackFlow AI, an expert in bottling & packaging technology. Always base answers on the context provided.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${lastUserMessage}`,
        },
      ],
    });

    const answer = completion.choices[0].message?.content || "No answer.";
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { answer: "Sorry, there was an error processing your request." },
      { status: 500 }
    );
  }
}

