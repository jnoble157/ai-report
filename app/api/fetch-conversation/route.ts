import { type NextRequest, NextResponse } from "next/server";
import { fetchAndParseConversation, validateConversationUrl } from "@/lib/conversation-parser";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !validateConversationUrl(url)) {
      return NextResponse.json(
        { error: "Invalid conversation URL. Must be a chat.openai.com or chatgpt.com URL" },
        { status: 400 }
      );
    }

    const conversation = await fetchAndParseConversation(url);
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error in fetch-conversation API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch conversation";

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

