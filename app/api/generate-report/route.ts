import { type NextRequest, NextResponse } from "next/server";
import { generateReport, validateApiKey } from "@/lib/openai";
import { fetchAndParseConversation, validateConversationUrl } from "@/lib/conversation-parser";
import { type Conversation } from "@/lib/conversation/types";

// Sample report for testing without API calls
const SAMPLE_REPORT = `# Executive Summary: AI and Machine Learning

## Key Points
- Machine learning is described as teaching computers through examples rather than explicit programming
- This approach allows computers to identify patterns and make decisions autonomously
- The conversation covered fundamental concepts and practical applications

## Applications Highlighted
- Recommendation systems (Netflix, Amazon, Spotify)
- Voice assistants and natural language processing
- Security systems (fraud detection, image recognition)
- Healthcare (medical diagnosis and predictions)
- Transportation (self-driving vehicles)

## Actionable Insights
1. Consider exploring basic machine learning models for business intelligence
2. Evaluate current processes that could benefit from pattern recognition
3. Research specific ML applications relevant to your industry

This conversation provided a solid foundation for understanding how machine learning works and its wide-ranging practical applications in today's technology landscape.`;

export async function POST(request: NextRequest) {
  try {
    // Log when the API is called
    console.log('Generate report API called');
    
    const { conversationUrl, reportType, format } = await request.json();
    console.log('Request params:', { conversationUrl, reportType, format });

    // Validate the conversation URL
    if (!conversationUrl) {
      console.error('Missing conversation URL');
      return NextResponse.json(
        { error: "Conversation URL is required" },
        { status: 400 }
      );
    }

    // For example URLs and special known case, return sample report without calling OpenAI
    const isExampleUrl = conversationUrl.includes('abc123-example');
    const isSpecialUrl = conversationUrl.includes('67e62fd1-f1f0-800f-85a2-bfbcf76d434b');
    
    if (isExampleUrl || isSpecialUrl) {
      console.log('Using example/special URL - returning sample report');
      // Create a report title based on the URL type
      let title = isSpecialUrl ? 'AI Reporter Development Report' : 'Machine Learning Overview';
      
      // Create a custom first line for the report
      let customIntro = isSpecialUrl 
        ? `# ${title}\n\nThis report summarizes the key aspects of the AI Reporter project, a tool designed to transform ChatGPT conversations into structured reports.\n\n`
        : `# ${title}\n\n`;
      
      return NextResponse.json({ 
        report: customIntro + SAMPLE_REPORT,
        note: 'This is a sample report using mock data' 
      });
    }
    
    // Normal flow for real URLs
    if (!validateConversationUrl(conversationUrl)) {
      console.error('Invalid conversation URL format');
      return NextResponse.json(
        { error: "Invalid conversation URL. Must be a chat.openai.com or chatgpt.com URL" },
        { status: 400 }
      );
    }

    // First fetch and parse the conversation
    console.log('Fetching conversation from:', conversationUrl);
    let conversation;
    try {
      conversation = await fetchAndParseConversation(conversationUrl);
    } catch (fetchError) {
      console.error('Error fetching conversation:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch conversation: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Validate that we have messages
    if (!conversation.messages || conversation.messages.length === 0) {
      console.error('No messages found in conversation');
      return NextResponse.json(
        { error: "No messages found in conversation" },
        { status: 400 }
      );
    }

    // Log the conversation for debugging
    console.log('Conversation to generate report from:', {
      id: conversation.id,
      title: conversation.title,
      messageCount: conversation.messages.length,
      sampleMessage: conversation.messages[0]
    });

    // Check that API key is valid
    const apiKeyValid = await validateApiKey();
    if (!apiKeyValid) {
      console.error('Invalid OpenAI API key');
      return NextResponse.json(
        { error: "Invalid OpenAI API key. Please check your .env.local file and add a valid key." },
        { status: 401 }
      );
    }

    // Then generate the report
    console.log('Generating report...');
    try {
      const report = await generateReport(conversation, {
        type: reportType || "executive",
        format: format || "markdown"
      });
      return NextResponse.json({ report });
    } catch (genError) {
      console.error('Error generating report:', genError);
      return NextResponse.json(
        { error: `Error generating report: ${genError instanceof Error ? genError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in generate-report API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate report" },
      { status: 500 }
    );
  }
}

