import { EventSourceMessage } from '@microsoft/fetch-event-source';

export interface DifyMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DifyChatRequest {
  query: string;
  user: string;
  response_mode?: 'streaming' | 'blocking';
  conversation_id?: string;
  inputs?: Record<string, any>;
  files?: Array<{
    type: string;
    transfer_method: 'remote_url' | 'local_file';
    url?: string;
    upload_file_id?: string;
  }>;
}

export interface DifyCompletionResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata: {
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      // ...other usage fields
    };
    retriever_resources?: Array<{
      position: number;
      dataset_id: string;
      dataset_name: string;
      document_id: string;
      document_name: string;
      segment_id: string;
      score: number;
      content: string;
    }>;
  };
  created_at: number;
}

export class DifyClient {
  private apiKey: string;
  private baseUrl: string;
  private conversationId: string | null = null;

  constructor(apiKey: string, baseUrl: string = 'http://localhost/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Get current conversation ID
   */
  public getConversationId(): string | null {
    return this.conversationId;
  }

  /**
   * Set conversation ID
   */
  public setConversationId(conversationId: string): void {
    this.conversationId = conversationId;
  }

  /**
   * Send a message to the Dify API in blocking mode
   */
  public async sendMessage(message: string, userId: string, inputs: Record<string, any> = {}): Promise<DifyCompletionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query: message,
          user: userId,
          inputs,
          response_mode: 'blocking',
          conversation_id: this.conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`Dify API Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.conversation_id) {
        this.conversationId = data.conversation_id;
      }
      return data;
    } catch (error) {
      console.error('Error sending message to Dify:', error);
      throw error;
    }
  }

  /**
   * Send a message to the Dify API in streaming mode
   * @param message The message to send
   * @param userId The user ID
   * @param onMessage Callback function for each message chunk
   * @param onError Callback function for errors
   * @param onComplete Callback function for completion
   * @param inputs Optional input parameters
   */
  public async sendStreamingMessage(
    message: string, 
    userId: string,
    onMessage: (text: string) => void,
    onError: (error: Error) => void,
    onComplete: () => void,
    inputs: Record<string, any> = {}
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query: message,
          user: userId,
          inputs,
          response_mode: 'streaming',
          conversation_id: this.conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`Dify API Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      const processText = async ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
        if (done) {
          if (buffer.length > 0) {
            processChunk(buffer);
          }
          onComplete();
          return;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));
              if (eventData.event === 'message') {
                onMessage(eventData.answer || '');
                if (eventData.conversation_id && !this.conversationId) {
                  this.conversationId = eventData.conversation_id;
                }
              } else if (eventData.event === 'message_end') {
                // End of message
              } else if (eventData.event === 'error') {
                onError(new Error(eventData.message || 'Unknown streaming error'));
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }
        
        // Continue reading
        return reader.read().then(processText);
      };
      
      const processChunk = (chunk: string) => {
        if (!chunk || !chunk.startsWith('data: ')) return;
        
        try {
          const eventData = JSON.parse(chunk.slice(6));
          if (eventData.event === 'message') {
            onMessage(eventData.answer || '');
          }
        } catch (e) {
          console.error('Error processing chunk:', e);
        }
      };
      
      await reader.read().then(processText);
    } catch (error) {
      console.error('Error in streaming message:', error);
      onError(error instanceof Error ? error : new Error('Unknown error in streaming'));
    }
  }

  /**
   * Get conversation history
   */
  public async getConversationHistory(userId: string, limit: number = 20): Promise<any> {
    if (!this.conversationId) {
      return { data: [] };
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/messages?user=${userId}&conversation_id=${this.conversationId}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Dify API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  public resetConversation(): void {
    this.conversationId = null;
  }
}