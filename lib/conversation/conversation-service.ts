import { Conversation, ConversationError, ConversationProvider } from './types';
import { ChatGPTProvider } from './providers/chatgpt';

export class ConversationService {
  private providers: ConversationProvider[] = [];

  constructor() {
    // Register providers
    this.registerProvider(new ChatGPTProvider());
    // Add more providers here as we support them
  }

  registerProvider(provider: ConversationProvider) {
    this.providers.push(provider);
  }

  findProvider(url: string): ConversationProvider | null {
    return this.providers.find(provider => provider.canHandle(url)) || null;
  }

  async fetchConversation(url: string): Promise<Conversation> {
    const provider = this.findProvider(url);
    
    if (!provider) {
      throw new ConversationError(
        'No provider found that can handle this URL',
        'INVALID_URL'
      );
    }

    try {
      return await provider.fetchConversation(url);
    } catch (error) {
      if (error instanceof ConversationError) {
        throw error;
      }
      throw new ConversationError(
        'Failed to fetch conversation',
        'FETCH_ERROR',
        error
      );
    }
  }

  validateUrl(url: string): { isValid: boolean; error?: string; provider?: string } {
    try {
      const provider = this.findProvider(url);
      if (!provider) {
        return {
          isValid: false,
          error: 'Unsupported conversation URL format'
        };
      }

      const validation = provider.validateUrl(url);
      return {
        ...validation,
        provider: provider.name
      };
    } catch {
      return {
        isValid: false,
        error: 'Invalid URL format'
      };
    }
  }
}
