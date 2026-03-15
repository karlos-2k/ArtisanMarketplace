import React from "react"; 
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react"; 
import "./Chatbot.css"; 
interface Props { 
  expanded: boolean; onToggle: () => void; }
  const ChatHeader: React.FC<Props> = ({ expanded, onToggle }) => { 
    return ( <div className="chatbot-header"> <div className="chatbot-user"> <img src="https://i.pravatar.cc/40" alt="Agent" className="chat-avatar" /> <div> <h4>Chat with Jessica</h4> <span className="online">We are online!</span> </div> </div> <div className="chatbot-actions"> <MoreVertical size={18} /> <button onClick={onToggle}> {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />} </button> </div> </div> ); }; export default ChatHeader;