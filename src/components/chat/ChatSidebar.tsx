// components/chat/ChatSidebar.tsx
"use client";

import React from "react";
import { ChatSession } from "../../types/chat";

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  activeChatId?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatSessions,
  onNewChat,
  onSelectChat,
  activeChatId,
}) => {
  return (
    <div className="flex flex-col h-full p-4">
      <button
        onClick={onNewChat}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chatSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectChat(session.id)}
            className={`p-2 rounded cursor-pointer ${
              session.id === activeChatId ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            <div className="font-semibold truncate">{session.title}</div>
            <div className="text-xs text-gray-500">
              {new Date(session.lastUpdated).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
