export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  metadata?: Record<string, unknown>;
  source: 'chatgpt' | 'claude' | 'gemini' | 'unknown';
}

export interface ConversationProvider {
  name: string;
  canHandle(url: string): boolean;
  fetchConversation(url: string): Promise<Conversation>;
  validateUrl(url: string): { isValid: boolean; error?: string };
}

export class ConversationError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_URL' | 'FETCH_ERROR' | 'PARSE_ERROR' | 'ACCESS_DENIED',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ConversationError';
  }
}
