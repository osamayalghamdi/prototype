import React, { useEffect, useRef } from 'react';

interface ChatbotCustomizerProps {
  iframeId?: string;
}

const ChatbotCustomizer: React.FC<ChatbotCustomizerProps> = ({ iframeId = 'dify-iframe' }) => {
  const customizationAppliedRef = useRef(false);

  useEffect(() => {
    const applyCustomization = () => {
      if (customizationAppliedRef.current) return;

      try {
        // Find the iframe in the parent document
        const iframeElement = document.querySelector(`iframe[title="Dify Chatbot"]`) as HTMLIFrameElement;
        if (!iframeElement || !iframeElement.contentWindow) {
          console.log("Iframe not found or not accessible, retrying...");
          return;
        }

        const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
        if (!iframeDoc) {
          console.log("Iframe document not accessible, retrying...");
          return;
        }

        // Create a style element to inject custom CSS
        const styleElement = iframeDoc.createElement('style');
        styleElement.textContent = `
          /* Apply FanBot red theme (#f04434) */
          :root {
            --color-components-button-primary-bg: #f04434 !important; 
            --color-components-button-primary-bg-hover: #d93d2f !important;
            --color-components-button-primary-bg-disabled: #f0443424 !important;
            --color-text-accent: #f04434 !important;
            --color-text-accent-secondary: #f56a62 !important;
            --color-components-main-nav-nav-button-text-active: #f04434 !important;
            --color-components-tab-active: #f04434 !important;
            --color-components-checkbox-bg: #f04434 !important;
            --color-components-checkbox-bg-hover: #d93d2f !important;
            --color-components-checkbox-bg-disabled: #ffacab !important;
            --color-components-radio-border-checked: #f04434 !important;
            --color-components-radio-border-checked-hover: #d93d2f !important;
            --color-components-radio-border-checked-disabled: #ffacab !important;
            --color-components-toggle-bg: #f04434 !important;
            --color-components-toggle-bg-hover: #d93d2f !important;
            --color-components-toggle-bg-disabled: #ffacab !important;
          }
          
          /* Hide the "Powered by Dify" element - both mobile and desktop versions */
          div[class*="shrink-0 items-center gap-1.5 px-2"] {
            display: none !important;
          }
          
          /* Hide elements with 'Powered by' text */
          div:has(.system-2xs-medium-uppercase) {
            display: none !important;
          }
          
          /* Additional specific targeting for bottom branding */
          .system-2xs-medium-uppercase {
            display: none !important;
          }
          
          /* Set the chat background to match FanBot's design */
          div[class*="bg-chatbot-bg"] {
            background-color: #FFFFFF !important;
            border-radius: 8px !important;
          }
          
          /* Make chat bubbles match FanBot's rounded style */
          div[class*="chat-bubble"] {
            border-radius: 12px !important;
            padding: 10px 14px !important;
          }
          
          /* Style AI responses similar to FanBot */
          div[class*="chat-bubble-ai"] {
            background-color: #F5F7FB !important;
            border: 1px solid #E9EBF0 !important;
          }
          
          /* User message styling */
          div[class*="chat-bubble-user"] {
            background-color: #f04434 !important;
            color: white !important;
          }
          
          /* Improve the input area styling */
          textarea {
            border-radius: 10px !important;
            border: 1px solid #E9EBF0 !important;
          }
          
          textarea:focus {
            border-color: #f04434 !important;
            box-shadow: 0 0 0 2px rgba(240, 68, 52, 0.2) !important;
          }
        `;
        
        // Append the style to the iframe's document
        iframeDoc.head.appendChild(styleElement);

        // Mark the customization as completed
        customizationAppliedRef.current = true;
        console.log("Dify chatbot customization applied successfully");
      } catch (error) {
        console.error("Error applying chatbot customization:", error);
      }
    };

    // First attempt
    applyCustomization();

    // Retry several times to ensure the iframe has loaded
    const retryAttempts = [500, 1000, 2000, 3000, 5000];
    retryAttempts.forEach(delay => {
      setTimeout(applyCustomization, delay);
    });

    // Set up a mutation observer to detect if the iframe is added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        applyCustomization();
      });
    });

    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });

    return () => {
      observer.disconnect();
    };
  }, [iframeId]);

  // This component doesn't render anything visible
  return null;
};

export default ChatbotCustomizer;