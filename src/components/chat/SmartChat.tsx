import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { chatResponses, quickActions } from "../../data/stadiumData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Mic, Send, X, MessageSquare, ArrowRight, Info, HelpCircle, Sparkles, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "../ui/avatar";

const SmartChat: React.FC = () => {
  const { language } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "bot"; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stadiumOptions = [
    "King Abdullah Sports City (Jeddah)",
    "Prince Abdullah Al-Faisal Stadium (Jeddah)",
    "King Fahd International Stadium (Riyadh)",
    "Al-Awwal Park (Riyadh)",
    "Prince Mohamed bin Fahd Stadium (Dammam)",
    "Prince Saud bin Jalawi Stadium (Khobar)",
    "King Abdulaziz Stadium (Mecca)",
    "I don't know",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
  
    setShowWelcome(false);
    setChatHistory(prev => [...prev, { type: "user", text: message }]);
    setIsLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: message })
      });
  
      const data = await res.json();
      setChatHistory(prev => [...prev, { type: "bot", text: data.answer }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { type: "bot", text: "حدث خطأ أثناء الاتصال بالمساعد." }]);
    }
  
    setMessage("");
    setIsLoading(false);
  };

  const handleQuickAction = (actionId: string) => {
    setShowWelcome(false);

    switch (actionId) {
      case "show-exits":
        setChatHistory(prev => [...prev,
          { type: "user", text: language === "en" ? "Where are the exits?" : "أين المخارج؟" },
          { type: "bot", text: chatResponses.exits[language] }
        ]);
        break;
      case "find-food":
        setChatHistory(prev => [...prev,
          { type: "user", text: language === "en" ? "Where can I find food?" : "أين يمكنني العثور على الطعام؟" },
          { type: "bot", text: chatResponses.food[language] }
        ]);
        break;
      case "lost-found":
        setChatHistory(prev => [...prev,
          { type: "user", text: language === "en" ? "I lost something" : "فقدت شيئًا" },
          { type: "bot", text: chatResponses.lostFound[language] }
        ]);
        break;
    }
  };

  const buttonAnimation = {
    initial: { scale: 0, rotate: -10 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6
      }
    },
    whileHover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.95 }
  };

  const containerAnimation = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const messageAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        variants={buttonAnimation}
        initial="initial"
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        className="fixed bottom-6 left-6 z-30 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label={language === "en" ? "Open chat assistant" : "فتح مساعد الدردشة"}
      >
        <MessageSquare size={26} className="animate-pulse" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed bottom-6 left-6 z-30 bg-white rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] flex flex-col border border-gray-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <Sparkles className="h-6 w-6 text-white" />
              </Avatar>
              <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></span>
            </div>
            <div>
              <h3 className="font-semibold">
                {language === "en" ? "FanBot Assistant" : "مساعد فان بوت"}
              </h3>
              <p className="text-xs text-white/80">
                {selectedStadium
                  ? language === "en"
                    ? `Your stadium guide for "${selectedStadium}"`
                    : `دليلك في ملعب "${selectedStadium}"`
                  : language === "en"
                    ? "Your stadium guide"
                    : "دليلك في الملعب"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label={language === "en" ? "Close chat" : "إغلاق الدردشة"}
          >
            <X size={18} />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
          {showWelcome && chatHistory.length === 0 && !selectedStadium ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <Avatar className="mr-2 mt-1">
                  <Sparkles className="h-5 w-5 text-primary" />
                </Avatar>
                <motion.div
                  variants={messageAnimation}
                  initial="hidden"
                  animate="visible"
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 max-w-[80%]"
                >
                  <p className="text-gray-700 font-medium">
                    {language === "en"
                      ? "Which stadium are you at or asking about?"
                      : "في أي ملعب أنت أو تريد السؤال عنه؟"}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {stadiumOptions.map((stadium, index) => (
                      <li key={index}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedStadium(stadium);
                            setChatHistory(prev => [...prev,
                              { type: "user", text: stadium },
                              { type: "bot", text: language === "en"
                                ? `Got it! You're asking about: ${stadium}`
                                : `تم! أنت تسأل عن: ${stadium}` }
                            ]);
                            setShowWelcome(false);
                          }}
                        >
                          {stadium}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                variants={messageAnimation}
                initial="hidden"
                animate="visible"
                className={`flex items-start ${chat.type === "user" ? "justify-end" : ""}`}
              >
                {chat.type === "bot" && (
                  <Avatar className="mr-2 mt-1">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    chat.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-gray-700"
                  }`}
                >
                  {chat.text}
                </div>
              </motion.div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center">
              <Avatar className="mr-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </Avatar>
              <div className="flex space-x-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-3 mb-3">
            {quickActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="whitespace-nowrap border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors text-xs"
                onClick={() => handleQuickAction(action.id)}
              >
                {action.label[language]}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === "en" ? "Type your question..." : "اكتب سؤالك..."}
              className="flex-1 bg-gray-50 border-gray-200 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              aria-label={language === "en" ? "Voice input" : "إدخال صوتي"}
            >
              <Mic size={18} />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              aria-label={language === "en" ? "Send message" : "إرسال رسالة"}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartChat;