import React from "react";
import "./Chatbot.css";

interface Props {
  sender: "bot" | "user";
  text: string;
}

const ChatMessage: React.FC<Props> = ({ sender, text }) => {
  return (
    <div className={`chat-message ${sender}`}>
      {text}
    </div>
  );
};

export default ChatMessage;
