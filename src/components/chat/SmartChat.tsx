import React, { useState, useEffect, useRef } from 'react';
import { SVG } from '@svgdotjs/svg.js';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

const SmartChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Welcome to FanBot! Ask me about the stadium.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svgInstanceRef = useRef<any>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // MCP server URL
  const MCP_SERVER_URL = 'http://localhost:3000'; // Update this to your deployed server URL if needed

  useEffect(() => {
    if (mapContainerRef.current && !svgInstanceRef.current) {
      const svgElement = mapContainerRef.current.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        mapContainerRef.current.innerHTML = '';
        const draw = SVG().addTo(mapContainerRef.current).size('100%', '100%');
        draw.svg(svgString);
        svgInstanceRef.current = draw;
      }
    }
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${MCP_SERVER_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: inputValue }
          ],
          model: 'dify-default',
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      const aiMessage = { type: 'bot', text: botResponse };
      setMessages(prev => [...prev, aiMessage]);

      // Check for highlight commands in the response
      parseAndHighlight(botResponse);
    } catch (error) {
      console.error('Error fetching from MCP server:', error);
      const errorMessage = { type: 'bot', text: 'Sorry, I encountered an error. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputValue('');
      // Focus the input field after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const parseAndHighlight = (text: string) => {
    const highlightMatch = text.match(/\[highlight:(.*?)\]/);
    const elementId = highlightMatch ? highlightMatch[1] : null;

    if (svgInstanceRef.current) {
      svgInstanceRef.current.find('.highlighted').forEach((el: any) => {
        el.removeClass('highlighted');
        el.fill('none');
        el.opacity(1);
      });

      if (elementId) {
        const elementToHighlight = svgInstanceRef.current.findOne(`#${elementId}`);
        if (elementToHighlight) {
          elementToHighlight.addClass('highlighted');
          elementToHighlight.fill('#ff9900');
          elementToHighlight.opacity(0.7);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="p-3 bg-blue-500 text-white font-medium rounded-t-lg">
        Knowledge Retrieval + Chatbot
      </div>
      
      <div 
        ref={chatHistoryRef}
        className="flex-grow p-4 overflow-y-auto"
        style={{ maxHeight: 'calc(100% - 120px)' }}
      >
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 p-3 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%] text-right' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {message.text.replace(/\[highlight:.*?\]/g, '')}
          </div>
        ))}
        {isLoading && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg mr-auto max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t flex">
        <input 
          ref={inputRef}
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Talk to Bot"
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="rounded-l-none bg-blue-500 hover:bg-blue-600"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SmartChat;