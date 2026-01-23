import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * 🌸 Kashivani Cultural Report Prompt (Conversation-Centric)
 */
const REPORT_GEN_PROMPT = `
You are Kashivani — an AI cultural voice guide for the city of Kashi (Varanasi).

Based on:
1. The selected Kashi agent (literature, heritage, music, food, moksha, or modern Kashi)
2. The voice conversation between the user and the AI agent

Generate a structured cultural conversation report.

The report must clearly capture:
- What the user was curious about (key concerns/questions)
- How the agent responded (key explanations/narrations)
- A holistic cultural summary of the experience

Return ONLY valid JSON in the following format:

{
  "agent": "Name of the Kashi agent (e.g., Kashi Sahitya, Kashi Heritage)",
  "user": "User name if mentioned, otherwise Anonymous",
  "timestamp": "Current date-time in ISO format",
  "theme": "Literature | Heritage | Music | Food | Moksha | Modern Kashi",
  "keyConcerns": ["main questions or curiosities raised by the user"],
  "keyResponses": ["important explanations, stories, or answers given by the agent"],
  "summary": "2–3 sentence summary of the cultural conversation",
  "culturalReferences": ["texts, ghats, traditions, music, food, rituals mentioned"],
  "suggestedExplorations": ["what the user can explore next related to Kashi"]
}

Guidelines:
- Keep tone poetic, respectful, and informative
- Do NOT include medical content
- Do NOT include markdown
- Do NOT include extra text
- Return JSON only
`;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, sessionDetail, messages } = await req.json();

    if (!sessionId || !sessionDetail || !messages) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const userInput =
      "Kashi Agent Info:\n" +
      JSON.stringify(sessionDetail) +
      "\n\nConversation:\n" +
      JSON.stringify(messages);

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        { role: "user", content: userInput },
      ],
    });

    const rawContent = completion.choices[0].message?.content || "";

    const cleaned = rawContent
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const reportJSON = JSON.parse(cleaned);

    // 💾 Save report
    await db
      .update(SessionChatTable)
      .set({
        report: reportJSON,
        conversation: messages,
      })
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(reportJSON);
  } catch (error) {
    console.error("Kashivani report generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate Kashivani report" },
      { status: 500 }
    );
  }
}
