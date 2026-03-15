import React, { useState } from "react";
import "./Chatbot.css";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";

type Message = {
  sender: "bot" | "user";
  text: string;
};

const ChatbotWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi 👋 Welcome to our Artisan Store! How can I help you today?" }
  ]);

  const handleUserMessage = (text: string) => {
    setMessages(prev => [...prev, { sender: "user", text }]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Thanks for reaching out! Our artisans craft each product with love ❤️" }
      ]);
    }, 700);
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">Artisan Assistant</div>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      <QuickReplies onSelect={handleUserMessage} />
    </div>
  );
};

export default ChatbotWindow;
