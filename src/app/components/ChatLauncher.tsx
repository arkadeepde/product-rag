"use client";

import { useState, useEffect } from "react";
import ChatBox from "./ChatBox"; // Import ChatBox
import { X, MessageSquare } from "lucide-react"; // Import icons

const ChatLauncher: React.FC<{
  productTitle: string;
  productDescription: string;
  productMetaData: string;
}> = ({ productTitle, productDescription, productMetaData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Toggle chat window with animation
  const toggleChat = () => {
    if (!isOpen) {
      setShowModal(true);
      setTimeout(() => {
        setIsOpen(true);
      }, 50); // Small delay for smooth effect
    } else {
      setIsOpen(false);
      setTimeout(() => {
        setShowModal(false);
      }, 300); // Delay matches closing animation
    }
  };

  // Control animation for first 3 times
  useEffect(() => {
    if (bounceCount < 3) {
      const interval = setInterval(() => {
        setBounceCount((prevCount) => prevCount + 1);
      }, 700); // 2-second interval

      return () => clearInterval(interval);
    } else {
      setShowAnimation(false);
    }
  }, [bounceCount]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Head with Tooltip */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip - Visible with Animation for First 3 Times */}
          <div
            className={`absolute right-16 bottom-2 bg-blue-600 text-white text-sm px-3 py-2 rounded-md shadow-lg ${
              showAnimation ? "animate-bounce" : ""
            }`}
          >
            💬 Got questions? Ask me!
          </div>

          {/* Chat Button */}
          <button
            onClick={toggleChat}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Chat Modal Popup with 90% width */}
      {showModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            isOpen
              ? "animate-scaleIn" // Open animation
              : "animate-scaleOut" // Close animation
          }`}
        >
          <div
            className={`bg-white w-11/12 max-w-6xl h-5/6 rounded-lg shadow-lg relative transform transition-transform duration-300 ${
              isOpen
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0 pointer-events-none"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={toggleChat}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Chat Box Component */}
            <div className="h-full p-4 overflow-hidden">
              <ChatBox
                productTitle={productTitle}
                productDescription={productDescription}
                productMetaData={productMetaData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLauncher;
