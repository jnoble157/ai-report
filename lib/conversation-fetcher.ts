"use client"

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
    // Basic validation
    if (!url.trim()) {
      throw new Error("Please provide a conversation URL")
    }

    // Check if it's a URL
    try {
      new URL(url)
    } catch (e) {
      throw new Error("Please provide a valid URL")
    }

    console.log("Fetching conversation from URL:", url)

    // For testing purposes, if we're in development mode and the URL contains "example",
    // return a mock conversation
    if (process.env.NODE_ENV === "development" && url.includes("example")) {
      console.log("Returning mock conversation for example URL")
      return getMockConversation()
    }

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
    console.log("Fetched HTML content, length:", html.length)

    // Parse the HTML to extract the conversation
    const $ = load(html)

    // Extract the title
    let title = $("title").text().replace(" - ChatGPT", "") || "Untitled Conversation"
    console.log("Extracted title:", title)

    // Extract the messages
    const messages: Message[] = []

    // Try multiple selectors to find messages
    const selectors = [".message", ".conversation-turn", ".chat-message", "[data-message]", ".chat-entry", ".chat-item"]

    for (const selector of selectors) {
      console.log(`Trying selector: ${selector}`)
      $(selector).each((_, element) => {
        // Try to determine the role
        let role: "user" | "assistant" = "user"

        // Check various attributes and classes to determine role
        const el = $(element)
        const classes = el.attr("class") || ""
        const dataRole = el.attr("data-role") || ""
        const roleText = el.find(".role, .author, .sender").text().toLowerCase()

        if (
          classes.includes("assistant") ||
          classes.includes("ai") ||
          dataRole.includes("assistant") ||
          roleText.includes("assistant") ||
          roleText.includes("chatgpt") ||
          roleText.includes("ai")
        ) {
          role = "assistant"
        }

        // Extract content
        const contentEl = el.find(".content, .message-content, .text")
        const content = contentEl.length > 0 ? contentEl.text().trim() : el.text().trim()

        if (content) {
          messages.push({ role, content })
        }
      })

      if (messages.length > 0) {
        console.log(`Found ${messages.length} messages using selector: ${selector}`)
        break
      }
    }

    // If we couldn't extract messages, try to find JSON data
    if (messages.length === 0) {
      console.log("Trying to extract JSON data from script tags")
      const scriptTags = $("script")

      scriptTags.each((_, element) => {
        const scriptContent = $(element).html() || ""

        // Look for JSON data that might contain the conversation
        if (
          scriptContent.includes('"mapping"') ||
          scriptContent.includes('"message"') ||
          scriptContent.includes('"conversation"')
        ) {
          try {
            // Try to extract JSON data
            const jsonMatches = scriptContent.match(/\{.*\}/s)
            if (jsonMatches) {
              const jsonData = JSON.parse(jsonMatches[0])
              console.log("Found potential JSON data:", Object.keys(jsonData))

              // Extract messages from various JSON structures
              if (jsonData.mapping) {
                // ChatGPT-like structure
                const mapping = jsonData.mapping
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
              } else if (jsonData.messages) {
                // Direct messages array
                jsonData.messages.forEach((msg: any) => {
                  if (msg.content) {
                    const role = (msg.role || msg.sender || "").includes("user") ? "user" : "assistant"
                    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)

                    if (content) {
                      messages.push({ role, content })
                    }
                  }
                })
              }

              // If we found a title in the JSON, use it
              if (jsonData.title) {
                title = jsonData.title
              }
            }
          } catch (e) {
            console.log("Error parsing JSON from script tag:", e)
          }
        }
      })
    }

    // Last resort: try to extract text with user/assistant patterns
    if (messages.length === 0) {
      console.log("Trying to extract conversation from text patterns")
      const bodyText = $("body").text()
      const lines = bodyText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)

      let currentRole: "user" | "assistant" = "user"
      let currentContent = ""

      lines.forEach((line) => {
        if (
          line.toLowerCase().includes("user:") ||
          line.toLowerCase().includes("human:") ||
          line.toLowerCase().includes("you:")
        ) {
          // Save the previous message if there is one
          if (currentContent) {
            messages.push({ role: currentRole, content: currentContent.trim() })
          }

          currentRole = "user"
          currentContent = line.replace(/user:|human:|you:/i, "").trim()
        } else if (
          line.toLowerCase().includes("assistant:") ||
          line.toLowerCase().includes("chatgpt:") ||
          line.toLowerCase().includes("ai:")
        ) {
          // Save the previous message if there is one
          if (currentContent) {
            messages.push({ role: currentRole, content: currentContent.trim() })
          }

          currentRole = "assistant"
          currentContent = line.replace(/assistant:|chatgpt:|ai:/i, "").trim()
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

    // If we still couldn't extract any messages, return a mock conversation
    if (messages.length === 0) {
      console.log("Could not extract conversation, returning mock data")
      return {
        title: "Could not parse conversation",
        messages: [
          {
            role: "user",
            content:
              "The conversation could not be parsed from the provided URL. Please ensure it is a publicly shared conversation.",
          },
          {
            role: "assistant",
            content:
              "I'll generate a report based on the URL you provided, but note that I couldn't access the actual conversation content.",
          },
        ],
      }
    }

    console.log(`Successfully extracted conversation with ${messages.length} messages`)
    return {
      title,
      messages,
    }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    throw error
  }
}

// Mock conversation for testing
function getMockConversation(): Conversation {
  return {
    title: "Example Conversation",
    messages: [
      {
        role: "user",
        content: "Can you help me understand how to use React hooks?",
      },
      {
        role: "assistant",
        content:
          'Of course! React Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are some of the most commonly used hooks:\n\n1. **useState** - Lets you add state to functional components\n2. **useEffect** - Lets you perform side effects in function components\n3. **useContext** - Lets you subscribe to React context without introducing nesting\n4. **useReducer** - An alternative to useState for complex state logic\n5. **useCallback** - Returns a memoized callback function\n6. **useMemo** - Returns a memoized value\n\nWould you like me to explain any of these in more detail?',
      },
      {
        role: "user",
        content: "Yes, please explain useState and useEffect in more detail.",
      },
      {
        role: "assistant",
        content:
          "### useState\n\nThe `useState` hook lets you add state to functional components. It returns a pair: the current state value and a function that lets you update it.\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  // Declare a state variable \"count\" with initial value 0\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n### useEffect\n\nThe `useEffect` hook lets you perform side effects in function components. Side effects could be data fetching, subscriptions, or manually changing the DOM.\n\n```jsx\nimport React, { useState, useEffect } from 'react';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  // Similar to componentDidMount and componentDidUpdate\n  useEffect(() => {\n    // Update the document title using the browser API\n    document.title = `You clicked ${count} times`;\n    \n    // Optional cleanup function (similar to componentWillUnmount)\n    return () => {\n      document.title = 'React App';\n    };\n  }, [count]); // Only re-run the effect if count changes\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\nThe second argument to `useEffect` is an array of dependencies. If any of these dependencies change, the effect will run again. If you provide an empty array `[]`, the effect will only run once after the initial render (like componentDidMount).\n\nWould you like me to explain any other hooks or provide more examples?",
      },
    ],
  }
}

