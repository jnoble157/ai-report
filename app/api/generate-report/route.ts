import { type NextRequest, NextResponse } from "next/server";
import { generateReport, validateApiKey } from "@/lib/openai";
import { fetchAndParseConversation, validateConversationUrl } from "@/lib/conversation-parser";
import { type Conversation } from "@/lib/conversation/types";
import { templateManager } from "@/lib/templates";

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
    
    const { content, reportType = 'detailed', inputType } = await request.json();
    console.log('Request params:', { content, reportType, inputType });

    // Validate the input
    if (!content) {
      console.error('Missing content');
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // For example URLs and special known case, return custom report
    const isExampleUrl = content.includes('abc123-example');
    const isSpecialUrl = content.includes('67e62fd1-f1f0-800f-85a2-bfbcf76d434b');
    
    if (isExampleUrl || isSpecialUrl) {
      console.log('Using example/special URL - generating custom report');
      
      // Create a proper conversation object for the AI Reporter project
      const conversation: Conversation = {
        id: "special-" + Date.now(),
        title: "AI Reporter Project Documentation",
        source: "special",
        messages: [
          {
            role: "user",
            content: `Project Name: AI Reporter
            
Description: AI Reporter is a web application that transforms content into structured, professional reports. The project aims to provide an easy way to convert various types of content (LLM conversations, scratch notes, and files) into well-formatted reports using different templates.

Key Features:
- Multiple input methods (LLM conversations, scratch notes, file uploads)
- Smart template system with different report types
- Modern UI with Next.js and Tailwind CSS
- Export options (PDF, markdown, text)
- Dark mode support

Technical Stack:
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for components
- OpenAI API integration
- Modular template system

Implementation Status:
- Core functionality complete
- Template system implemented
- UI components in place
- Export features partially complete
- Deployment pending`
          }
        ]
      };

      // Generate a proper report using the template system
      const report = await generateReport(conversation, {
        type: reportType,
        format: "markdown",
        inputType: "scratch"
      });

      return NextResponse.json({ report });
    }

    let conversation: Conversation;
    
    // Handle different input types
    switch (inputType) {
      case "llm":
        // Validate and fetch conversation for LLM input
        if (!validateConversationUrl(content)) {
          console.error('Invalid conversation URL format');
          return NextResponse.json(
            { error: "Invalid conversation URL. Must be a chat.openai.com or chatgpt.com URL" },
            { status: 400 }
          );
        }

        try {
          conversation = await fetchAndParseConversation(content);
        } catch (fetchError) {
          console.error('Error fetching conversation:', fetchError);
          return NextResponse.json(
            { error: `Failed to fetch conversation: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
            { status: 500 }
          );
        }
        break;

      case "scratch":
        // Create a conversation object from scratch notes
        conversation = {
          id: "scratch-" + Date.now(),
          title: "Scratch Notes",
          source: "scratch",
          messages: [
            {
              role: "user",
              content: content
            }
          ]
        };
        break;

      case "file":
        // Create a conversation object from file content
        conversation = {
          id: "file-" + Date.now(),
          title: "File Content",
          source: "file",
          messages: [
            {
              role: "user",
              content: content
            }
          ]
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid input type" },
          { status: 400 }
        );
    }

    // Validate that we have content to process
    if (!conversation.messages || conversation.messages.length === 0) {
      console.error('No content found to process');
      return NextResponse.json(
        { error: "No content found to process" },
        { status: 400 }
      );
    }

    // Check that API key is valid
    const apiKeyValid = await validateApiKey();
    if (!apiKeyValid) {
      console.error('Invalid OpenAI API key');
      return NextResponse.json(
        { error: "Invalid OpenAI API key. Please check your .env.local file and add a valid key." },
        { status: 401 }
      );
    }

    // Generate the report
    console.log('Generating report...');
    try {
      const report = await generateReport(conversation, {
        type: reportType,
        format: "markdown",
        inputType: inputType
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

