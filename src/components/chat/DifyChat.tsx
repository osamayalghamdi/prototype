import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, X, Loader2, RefreshCw, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { DifyClient } from '../../services/DifyClient';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
}

interface DifyChatProps {
  apiKey: string;
  apiBaseUrl?: string;
  initialMessages?: Message[];
  placeholder?: string;
  welcomeMessage?: string;
  className?: string;
  showTitle?: boolean;
  title?: string;
}

const DifyChat: React.FC<DifyChatProps> = ({
  apiKey,
  apiBaseUrl = 'http://localhost/v1',
  initialMessages = [],
  placeholder = 'Ask me anything...',
  welcomeMessage = 'Hello! How can I help you today?',
  className = '',
  showTitle = true,
  title = 'Knowledge Retrieval + Chatbot',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState<string>(() => {
    // Generate a persistent user ID or use from local storage
    const storedId = localStorage.getItem('dify_user_id');
    if (storedId) return storedId;
    
    const newId = uuidv4();
    localStorage.setItem('dify_user_id', newId);
    return newId;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [difyClient] = useState<DifyClient>(() => new DifyClient(apiKey, apiBaseUrl));
  
  // Initialize with welcome message
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else if (welcomeMessage) {
      setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: welcomeMessage,
          createdAt: new Date()
        }
      ]);
    }
  }, [initialMessages, welcomeMessage]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      createdAt: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input field
    setInput('');
    
    // Create an initial assistant message with streaming state
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(true);

    try {
      // Start streaming mode
      await difyClient.sendStreamingMessage(
        userMessage.content,
        userId,
        (text) => {
          // Update message content with each chunk
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: msg.content + text } 
                : msg
            )
          );
        },
        (error) => {
          console.error('Error in streaming response:', error);
          // Update message to show error
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { 
                    ...msg, 
                    isStreaming: false, 
                    content: msg.content || 'Sorry, an error occurred while generating the response.' 
                  } 
                : msg
            )
          );
          setIsLoading(false);
        },
        () => {
          // When stream completes
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, isStreaming: false } 
                : msg
            )
          );
          setIsLoading(false);
          // Focus back on input
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { 
                ...msg, 
                isStreaming: false, 
                content: 'Sorry, an error occurred while connecting to the chat service.' 
              } 
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    difyClient.resetConversation();
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: welcomeMessage,
        createdAt: new Date()
      }
    ]);
  };

  const renderMessageContent = (content: string) => {
    // Handle markdown-like content or special formatting if needed
    return content;
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-md ${className}`}>
      {showTitle && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot size={18} />
            <h2 className="text-lg font-medium">{title}</h2>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {renderMessageContent(message.content)}
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-gray-500 animate-blink"></span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={resetConversation}
            disabled={isLoading}
            title="Reset conversation"
          >
            <RefreshCw size={18} />
          </Button>
          
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              className="w-full p-3 pr-10 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
            {input && (
              <button 
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setInput('')}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ''}
            className="flex-shrink-0"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DifyChat;