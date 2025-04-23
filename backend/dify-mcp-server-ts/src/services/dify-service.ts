import axios from 'axios';

export interface DifyCompletionOptions {
  inputs?: Record<string, any>;
  query: string;
  response_mode?: 'streaming' | 'blocking';
  user?: string;
  conversation_id?: string;
}

export interface DifyMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class DifyService {
  private readonly baseUrl: string;
  private readonly appSecretKeys: string[];
  
  constructor(baseUrl: string, appSecretKeys: string[]) {
    this.baseUrl = baseUrl;
    this.appSecretKeys = appSecretKeys;
  }

  /**
   * Get a random app secret key from the available keys
   */
  private getAppSecretKey(): string {
    if (this.appSecretKeys.length === 0) {
      throw new Error('No Dify app secret keys configured');
    }
    const randomIndex = Math.floor(Math.random() * this.appSecretKeys.length);
    return this.appSecretKeys[randomIndex];
  }

  /**
   * Create headers for Dify API requests
   */
  private createHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAppSecretKey()}`
    };
  }

  /**
   * Send a completion request to Dify API
   */
  async createCompletion(options: DifyCompletionOptions): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/completion-messages`,
        options,
        { headers: this.createHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error calling Dify API:', error.message);
      throw error;
    }
  }

  /**
   * Send a streaming completion request to Dify API
   * This returns the raw response for streaming
   */
  async createStreamingCompletion(options: DifyCompletionOptions): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/completion-messages`,
        { ...options, response_mode: 'streaming' },
        { 
          headers: this.createHeaders(),
          responseType: 'stream' 
        }
      );
      return response;
    } catch (error: any) {
      console.error('Error calling Dify streaming API:', error.message);
      throw error;
    }
  }

  /**
   * Get conversation history from Dify API
   */
  async getConversationHistory(conversationId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/messages?conversation_id=${conversationId}`,
        { headers: this.createHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting conversation history:', error.message);
      throw error;
    }
  }
}