import React from "react";
import { MessageCircle } from "lucide-react";
import "./Chatbot.css";

interface Props {
  onClick: () => void;
}

const ChatbotButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className="chatbot-float-btn" onClick={onClick}>
      <MessageCircle size={26} />
    </button>
  );
};

export default ChatbotButton;
