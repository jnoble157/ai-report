import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
// Update the import to use the new conversation fetcher
import { fetchConversation } from "./conversation-fetcher"

interface GenerateReportParams {
  conversationUrl: string
  reportType: string
}

export async function generateReport({ conversationUrl, reportType }: GenerateReportParams): Promise<string> {
  try {
    // Fetch the conversation from the URL
    const conversation = await fetchConversation(conversationUrl)

    // Format the conversation for the prompt
    const formattedConversation = conversation.messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n")

    // Define the prompt based on the report type
    let prompt = ""
    let system = ""

    switch (reportType) {
      case "executive":
        system = `You are a professional report generator. Your task is to create an executive summary report from a conversation.
                 Focus on the key points, decisions, and outcomes. Use clear headings, bullet points, and concise language.`
        prompt = `Generate an executive summary report from the following conversation titled "${conversation.title}".
                 Format the report in Markdown with clear headings, bullet points, and concise language.
                 
                 Conversation:
                 ${formattedConversation}`
        break
      case "detailed":
        system = `You are a professional report generator. Your task is to create a detailed breakdown report from a conversation.
                 Analyze the conversation section by section, including all important details and context.`
        prompt = `Generate a detailed breakdown report from the following conversation titled "${conversation.title}".
                 Format the report in Markdown with clear headings, subheadings, and well-structured paragraphs.
                 
                 Conversation:
                 ${formattedConversation}`
        break
      case "actionable":
        system = `You are a professional report generator. Your task is to create an actionable insights report from a conversation.
                 Focus on action items, next steps, and practical recommendations.`
        prompt = `Generate an actionable insights report from the following conversation titled "${conversation.title}".
                 Format the report in Markdown with clear headings, numbered lists for actions, and prioritized recommendations.
                 
                 Conversation:
                 ${formattedConversation}`
        break
      default:
        system = `You are a professional report generator. Your task is to create a comprehensive report from a conversation.`
        prompt = `Generate a comprehensive report from the following conversation titled "${conversation.title}".
                 Include key points, context, and any important details.
                 Format the report in Markdown with clear headings and well-structured content.
                 
                 Conversation:
                 ${formattedConversation}`
    }

    // Use the environment variable for the API key
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system,
      prompt,
    })

    return text
  } catch (error) {
    console.error("Error generating report:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to generate report")
  }
}

