import OpenAI from 'openai';
import { type Conversation } from './conversation/types';
import { templateManager } from './templates';
import { type InputType, type ReportFormat } from './templates/types';

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
  type: 'executive' | 'detailed' | 'meeting' | 'project' | 'research' | 'product';
  format?: ReportFormat;
  inputType?: InputType;
}

export async function generateReport(conversation: Conversation, options: ReportOptions) {
  const template = templateManager.getTemplate(options.type);
  if (!template) {
    throw new Error(`Template ${options.type} not found`);
  }

  const format = options.format || 'markdown';
  const inputType = options.inputType || 'llm';

  try {
    const client = getAPIClient();
    
    // Determine which model to use
    const apiKey = process.env.OPENAI_API_KEY || '';
    const model = apiKey.startsWith('sk-or-') 
      ? 'google/gemini-2.5-pro-exp-03-25:free' // OpenRouter for Gemini
      : 'gpt-3.5-turbo'; // Default to OpenAI
    
    console.log(`Generating report with model: ${model}`);

    // Format the content based on input type
    let content = '';
    if (inputType === 'scratch' || inputType === 'file') {
      content = conversation.messages[0].content;
    } else {
      content = conversation.messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
    }

    // Get the system prompt from the template manager
    const systemPrompt = templateManager.getSystemPrompt(template, {
      inputType,
      format,
      content,
      title: conversation.title
    });
    
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${inputType === 'llm' ? 'Title: ' + (conversation.title || 'Untitled Conversation') + '\n\n' : ''}Content:\n${content}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Get the report content and append the date
    let reportContent = completion.choices[0].message.content || '';
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Add a line break and the date at the end
    reportContent += `\n\nGenerated on ${currentDate}`;

    return reportContent;
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
  const apiKey = process.env.OPENAI_API_KEY;
  return !!apiKey;
}
