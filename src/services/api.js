// n8n Webhook Configuration
// Your n8n webhook URL for the Bookyard Academy chatbot
const N8N_WEBHOOK_URL = 'https://n8n.tenear.com/webhook/parent-chat';

const TIMEOUT_MS = 60000; // 60 second timeout

export const chatService = {
  /**
   * Send a message to the n8n AI chatbot
   * @param {string} message - The user's message
   * @param {object} context - Optional context (userId, timestamp, etc.)
   * @returns {Promise<{reply: string}>} - The AI's response
   */
  async sendMessage(message, context = {}) {
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          timestamp: new Date().toISOString(),
          ...context,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response
      if (!data.reply && data.reply !== '') {
        throw new Error('Invalid response from server');
      }

      return {
        reply: data.reply,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      
      throw error;
    }
  },
};

export default { chat: chatService };
