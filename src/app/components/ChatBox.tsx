"use client";

import { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatBoxProps {
  productTitle: string;
  productDescription: string;
  productMetaData: string;
}

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const ChatBox: React.FC<ChatBoxProps> = ({
  productTitle,
  productDescription,
  productMetaData,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayedAssistantMessage, setDisplayedAssistantMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingSpeed = 30;

  const predefinedQuestions = [
    "What are the key features?",
    "Is there a discount available?",
    "Can you tell me about the product warranty?",
    "What’s the shipping information?",
  ];

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`chatHistory_${productTitle}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    }

    // Initialize default messages if no history found
    setMessages([
      {
        role: "system",
        content: `You are a product assistant. Here is the product information:\n
        **Title:** ${productTitle}\n
        **Description:** ${productDescription}\n
        **Data:** ${productMetaData}`,
      },
      {
        role: "assistant",
        content:
          "👋 Hi! I'm your product assistant. Ask me anything about this product, or choose from the questions below!",
      },
    ]);
  }, [productTitle]);

  // Save messages to localStorage per product
  useEffect(() => {
    if (messages.length > 2) {
      localStorage.setItem(`chatHistory_${productTitle}`, JSON.stringify(messages));
    }
  }, [messages, productTitle]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, displayedAssistantMessage]);

  const handleSubmit = async (question?: string): Promise<void> => {
    const input = question || userInput.trim();
    if (!input) {
      setError("⚠️ Please enter a message before sending.");
      return;
    }

    setError(null);
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);
    setDisplayedAssistantMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...newMessages, { role: "assistant", content: "" }]);
        typeAssistantMessage(data.message, newMessages);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "⚠️ Error fetching response!" }]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setMessages([...newMessages, { role: "assistant", content: "❗ Failed to get response." }]);
      setIsLoading(false);
    }
  };

  const typeAssistantMessage = (fullMessage: string, updatedMessages: ChatMessage[]) => {
    let index = 0;
    setDisplayedAssistantMessage("");

    const typingInterval = setInterval(() => {
      setDisplayedAssistantMessage((prev) => {
        const next = prev + fullMessage.charAt(index);
        index++;
        return next;
      });

      if (index >= fullMessage.length) {
        clearInterval(typingInterval);
        setMessages([...updatedMessages, { role: "assistant", content: fullMessage }]);
        setDisplayedAssistantMessage("");
        setIsLoading(false);
      }
    }, typingSpeed);
  };

  const handlePredefinedQuestion = async (question: string) => {
    if (!isLoading) {
      await handleSubmit(question);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(`chatHistory_${productTitle}`);
    setMessages([
      {
        role: "system",
        content: `You are a product assistant. Here is the product information:\n
        **Title:** ${productTitle}\n
        **Description:** ${productDescription}\n
        **Data:** ${productMetaData}`,
      },
      {
        role: "assistant",
        content:
          "👋 Hi! I'm your product assistant. Ask me anything about this product, or choose from the questions below!",
      },
    ]);
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Chat with AI Assistant</h2>

      {/* Clear History */}
      <button
        className="text-sm text-red-500 hover:underline mb-3"
        onClick={handleClearHistory}
      >
        Clear Chat History
      </button>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="h-80 overflow-y-auto mb-3 bg-gray-50 p-2 border rounded"
      >
        {messages.slice(1).map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm ${
              msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-700"
            }`}
          >
            <div className="p-2 rounded-lg bg-gray-100 inline-block text-left max-w-xs">
              <MarkdownRenderer content={msg.content} />
            </div>
          </div>
        ))}

        {displayedAssistantMessage && (
          <div className="mb-2 text-left text-sm text-gray-700">
            <div className="p-2 rounded-lg bg-gray-100 inline-block text-left max-w-xs">
              <MarkdownRenderer content={displayedAssistantMessage} />
            </div>
          </div>
        )}

        {isLoading && !displayedAssistantMessage && (
          <div className="text-left text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Predefined Questions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {predefinedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handlePredefinedQuestion(question)}
            className="bg-gray-200 text-sm px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className={`w-full p-2 border rounded-lg shadow-sm focus:ring ${
            error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          placeholder="Ask a question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={() => handleSubmit()}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default ChatBox;
