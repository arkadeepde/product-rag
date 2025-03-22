"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface ChatBoxProps {
  productTitle: string;
  productDescription: string;
  productMetaData: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  productTitle,
  productDescription,
  productMetaData,
}) => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are a product assistant. Here is the product information:\n
      **Title:** ${productTitle}\n
      **Description:** ${productDescription}\n
      **Data:** ${localStorage.getItem("productData")}`,
    },
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your product assistant. Ask me anything about this product, or choose from the questions below!",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a ref to the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Predefined questions
  const predefinedQuestions = [
    "What are the key features?",
    "Is there a discount available?",
    "Can you tell me about the product warranty?",
    "What’s the shipping information?",
  ];

  // Scroll to the bottom of the chat after messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle user input submission
  const handleSubmit = async (question?: string) => {
    const input = question || userInput.trim();

    // Validation check
    if (!input) {
      setError("⚠️ Please enter a message before sending.");
      return;
    }

    setError(null);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    // Send API request
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "⚠️ Error fetching response!" }]);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setMessages([...newMessages, { role: "assistant", content: "❗ Failed to get response." }]);
    }

    setIsLoading(false);
  };

  // Handle predefined question click - Calls API directly
  const handlePredefinedQuestion = async (question: string) => {
    await handleSubmit(question);
  };

  // Handle key press (submit on Enter key)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Chat with AI Assistant</h2>

      {/* Chat Messages Container */}
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
              {/* Render message with Markdown */}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
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
            className="bg-gray-200 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
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
          onKeyDown={handleKeyPress} // Submit on Enter
        />
        <button
          onClick={() => handleSubmit()}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default ChatBox;
