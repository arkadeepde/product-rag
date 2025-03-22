import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Make the OpenAI API request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or "gpt-3.5-turbo" if you prefer
      messages: messages, // Array of messages for conversation context
    });

    // Extract and send back the response
    return NextResponse.json({
      success: true,
      message: completion.choices[0]?.message?.content || "No response found.",
    });
  } catch (error : unknown) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
