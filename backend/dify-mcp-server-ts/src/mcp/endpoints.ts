import { Express, Request, Response } from 'express';
import { DifyService, DifyCompletionOptions } from '../services/dify-service';

// Define interfaces for MCP requests and responses
interface MCPMessage {
  role: string;
  content: string;
}

interface MCPCompletionRequest {
  messages: MCPMessage[];
  model: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  user_id?: string;
  conversation_id?: string;
  context?: any;
}

interface MCPCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: MCPMessage;
    finish_reason: string;
  }[];
}

/**
 * Creates MCP compatible endpoints using the Express application
 * @param app Express application
 * @param difyService Service to interact with Dify API
 */
export function createMCPEndpoints(app: Express, difyService: DifyService) {
  // MCP models endpoint
  app.get('/v1/models', (req: Request, res: Response) => {
    res.json({
      object: 'list',
      data: [
        {
          id: 'dify-default',
          object: 'model',
          created: Date.now(),
          owned_by: 'dify'
        }
      ]
    });
  });

  // MCP completions endpoint
  app.post('/v1/chat/completions', async (req: Request, res: Response) => {
    const mcpRequest = req.body as MCPCompletionRequest;
    
    // Convert MCP request to Dify format
    const lastMessage = mcpRequest.messages[mcpRequest.messages.length - 1];
    const query = lastMessage.content;
    
    if (lastMessage.role !== 'user') {
      return res.status(400).json({
        error: {
          message: 'Last message must have role "user"',
          type: 'invalid_request_error'
        }
      });
    }

    try {
      const difyOptions: DifyCompletionOptions = {
        query,
        response_mode: mcpRequest.stream ? 'streaming' : 'blocking',
        user: mcpRequest.user_id,
        conversation_id: mcpRequest.conversation_id
      };
      
      // Handle context/inputs if provided
      if (mcpRequest.context) {
        difyOptions.inputs = mcpRequest.context;
      }
      
      // Handle streaming response
      if (mcpRequest.stream) {
        const difyResponse = await difyService.createStreamingCompletion(difyOptions);
        
        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Pipe the Dify streaming response but transform to MCP format
        difyResponse.data.pipe(res);
        
        // Handle errors in the stream
        difyResponse.data.on('error', (err: Error) => {
          console.error('Error in streaming response:', err);
          res.end();
        });
      } else {
        // Handle blocking response
        const difyResponse = await difyService.createCompletion(difyOptions);
        
        // Convert Dify response to MCP format
        const mcpResponse: MCPCompletionResponse = {
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: mcpRequest.model || 'dify-default',
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: difyResponse.answer
              },
              finish_reason: 'stop'
            }
          ]
        };
        
        res.json(mcpResponse);
      }
    } catch (error: any) {
      console.error('Error processing completion request:', error);
      res.status(500).json({
        error: {
          message: `Error processing completion request: ${error.message}`,
          type: 'server_error'
        }
      });
    }
  });

  // Additional MCP endpoints like /v1/completions can be added here
}