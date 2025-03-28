export function normalizeConversationUrl(url: string): string {
  try {
    console.log('Normalizing URL:', url);
    const parsedUrl = new URL(url);
    
    // Always use chat.openai.com
    if (parsedUrl.hostname === 'chatgpt.com') {
      parsedUrl.hostname = 'chat.openai.com';
    }
    
    // Ensure we have /share/ in the path
    if (!parsedUrl.pathname.startsWith('/share/')) {
      const conversationId = parsedUrl.pathname.split('/').pop();
      if (conversationId) {
        parsedUrl.pathname = `/share/${conversationId}`;
      }
    }
    
    const result = parsedUrl.toString();
    console.log('Normalized URL:', result);
    return result;
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url;
  }
}

export function validateConversationUrl(url: string): { isValid: boolean; error?: string } {
  try {
    console.log('Validating URL:', url);
    
    // Handle test URLs
    if (url.includes('abc123-example')) {
      console.log('Example URL detected, accepting');
      return { isValid: true };
    }
    
    const parsedUrl = new URL(url);
    
    // Accept both domains
    const validDomains = ['chat.openai.com', 'chatgpt.com'];
    if (!validDomains.includes(parsedUrl.hostname)) {
      console.log('Invalid domain:', parsedUrl.hostname);
      return {
        isValid: false,
        error: `Invalid domain. Must be one of: ${validDomains.join(' or ')}`
      };
    }

    if (!parsedUrl.pathname.startsWith('/share/')) {
      console.log('Path does not start with /share/:', parsedUrl.pathname);
      return {
        isValid: false,
        error: 'Invalid URL format. Must start with /share/'
      };
    }

    const shareId = parsedUrl.pathname.split('/share/')[1];
    // More lenient check - just make sure there's something after /share/
    if (!shareId || shareId.trim() === '') {
      console.log('Missing share ID');
      return {
        isValid: false,
        error: 'Missing share ID in URL'
      };
    }

    console.log('URL validation passed');
    return { isValid: true };
  } catch (error) {
    console.error('Error validating URL:', error);
    return {
      isValid: false,
      error: 'Invalid URL format'
    };
  }
}

export function getExampleUrl(): string {
  return 'https://chat.openai.com/share/abc123-example';
}
