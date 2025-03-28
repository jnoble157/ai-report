import { load } from "cheerio"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Conversation {
  title: string
  messages: Message[]
}

export async function fetchConversation(url: string): Promise<Conversation> {
  try {
    // Update the URL validation logic to be more flexible
    // Replace the current validation code with this:

    // Validate the URL format
    if (!url.trim()) {
      throw new Error("Please provide a conversation URL")
    }

    // Check if it's a URL
    try {
      new URL(url)
    } catch (e) {
      throw new Error("Please provide a valid URL")
    }

    // For debugging
    console.log("Attempting to fetch conversation from URL:", url)

    // Fetch the HTML content from the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML to extract the conversation
    const $ = load(html)

    // Extract the title
    const title = $("title").text().replace(" - ChatGPT", "") || "Untitled Conversation"

    // Extract the messages
    const messages: Message[] = []

    // This selector might need to be adjusted based on the actual HTML structure
    $(".message").each((_, element) => {
      const roleElement = $(element).find(".role")
      const role = roleElement.text().toLowerCase().includes("user") ? "user" : "assistant"

      const contentElement = $(element).find(".content")
      const content = contentElement.text().trim()

      if (content) {
        messages.push({ role, content })
      }
    })

    // If we couldn't extract messages using the above method, try an alternative approach
    if (messages.length === 0) {
      // Look for JSON data in the page that might contain the conversation
      const scriptTags = $("script")
      let conversationData = null

      scriptTags.each((_, element) => {
        const scriptContent = $(element).html() || ""
        if (scriptContent.includes('"mapping"') && scriptContent.includes('"message"')) {
          try {
            // Extract JSON data from the script tag
            const jsonMatch = scriptContent.match(/\{.*\}/s)
            if (jsonMatch) {
              const jsonData = JSON.parse(jsonMatch[0])
              conversationData = jsonData
            }
          } catch (e) {
            // Ignore parsing errors and continue
          }
        }
      })

      if (conversationData && conversationData.mapping) {
        // Process the conversation data to extract messages
        const mapping = conversationData.mapping
        const messageIds = Object.keys(mapping).filter((id) => mapping[id].message)

        messageIds.forEach((id) => {
          const message = mapping[id].message
          if (message && message.content && message.content.parts) {
            const role = message.author.role === "user" ? "user" : "assistant"
            const content = message.content.parts.join("\n").trim()

            if (content) {
              messages.push({ role, content })
            }
          }
        })
      }
    }

    // If we still couldn't extract messages, try a more generic approach
    if (messages.length === 0) {
      // Look for alternating user/assistant patterns in the page
      const userElements = $(".user-message, .human-message, .user")
      const assistantElements = $(".assistant-message, .ai-message, .assistant")

      userElements.each((index, element) => {
        const content = $(element).text().trim()
        if (content) {
          messages.push({ role: "user", content })
        }
      })

      assistantElements.each((index, element) => {
        const content = $(element).text().trim()
        if (content) {
          messages.push({ role: "assistant", content })
        }
      })
    }

    // If we still couldn't extract messages, use a fallback method
    if (messages.length === 0) {
      // Extract all text and make a best guess at the conversation structure
      const bodyText = $("body").text()
      const lines = bodyText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)

      let currentRole: "user" | "assistant" = "user"
      let currentContent = ""

      lines.forEach((line) => {
        if (line.toLowerCase().includes("user:") || line.toLowerCase().includes("human:")) {
          // Save the previous message if there is one
          if (currentContent) {
            messages.push({ role: currentRole, content: currentContent.trim() })
          }

          currentRole = "user"
          currentContent = line.replace(/user:|human:/i, "").trim()
        } else if (line.toLowerCase().includes("assistant:") || line.toLowerCase().includes("chatgpt:")) {
          // Save the previous message if there is one
          if (currentContent) {
            messages.push({ role: currentRole, content: currentContent.trim() })
          }

          currentRole = "assistant"
          currentContent = line.replace(/assistant:|chatgpt:/i, "").trim()
        } else {
          // Append to the current content
          currentContent += " " + line
        }
      })

      // Save the last message
      if (currentContent) {
        messages.push({ role: currentRole, content: currentContent.trim() })
      }
    }

    // If we still couldn't extract any messages, throw an error
    if (messages.length === 0) {
      throw new Error(
        "Could not extract conversation from the provided URL. The conversation might be private or the URL might be invalid.",
      )
    }

    return {
      title,
      messages,
    }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch conversation")
  }
}

