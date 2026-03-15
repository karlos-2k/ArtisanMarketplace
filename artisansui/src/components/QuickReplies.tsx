import React from "react";
import "./Chatbot.css";

interface Props {
  onSelect: (text: string) => void;
}

const replies = [
  "🛍 View Products",
  "📦 Track My Order",
  "🎨 Artisan Stories",
  "📞 Contact Support"
];

const QuickReplies: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="quick-replies">
      {replies.map((r, i) => (
        <button key={i} onClick={() => onSelect(r)}>
          {r}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
