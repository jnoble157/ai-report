import OpenAI from 'openai';
import { type Conversation } from './conversation/types';

// Create a function to get the API client
function getAPIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    throw new Error('API key is not configured');
  }
  
  // Support OpenRouter for Gemini access
  if (apiKey.startsWith('sk-or-')) {
    console.log('Using OpenRouter API');
    return new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1'
    });
  }
  
  // Default to standard OpenAI
  return new OpenAI({
    apiKey: apiKey,
  });
}

export interface ReportOptions {
  type: 'executive' | 'detailed' | 'actionable';
  format?: 'markdown' | 'text';
}

export async function generateReport(conversation: Conversation, options: ReportOptions) {
  const systemPrompt = `You are an expert at analyzing conversations and creating structured reports.
Generate a ${options.type} report from the provided conversation.
Format the output in ${options.format || 'markdown'}.

For executive summary:
- Focus on key decisions, outcomes, and main points
- Keep it concise and business-oriented
- Include actionable takeaways

For detailed report:
- Provide comprehensive analysis of the conversation
- Break down by topics and themes
- Include relevant quotes and context

For actionable report:
- Focus on action items and next steps
- List responsibilities and deadlines if mentioned
- Highlight decisions that require follow-up`;

  try {
    const client = getAPIClient();
    
    // Determine which model to use
    const apiKey = process.env.OPENAI_API_KEY || '';
    const model = apiKey.startsWith('sk-or-') 
      ? 'google/gemini-2.5-pro-exp-03-25:free' // OpenRouter for Gemini
      : 'gpt-3.5-turbo'; // Default to OpenAI
    
    console.log(`Generating report with model: ${model}`);
    
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Title: ${conversation.title || 'Untitled Conversation'}

Conversation:
${conversation.messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n')}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating report:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing API key. Please check your configuration.');
      }
      if (error.message.includes('Rate limit')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      if (error.message.includes('billing') || error.message.includes('quota')) {
        throw new Error('API quota exceeded or billing issue. Please check your account.');
      }
    }
    
    throw new Error('Failed to generate report: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function validateApiKey() {
  try {
    // Check if the API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('API key is not set in environment variables');
      return false;
    }
    
    // Test the API key with a simple call
    const client = getAPIClient();
    
    // For OpenRouter, just return true as we can't easily test
    if (process.env.OPENAI_API_KEY.startsWith('sk-or-')) {
      return true;
    }
    
    // For OpenAI, test with a models list call
    await client.models.list();
    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}
