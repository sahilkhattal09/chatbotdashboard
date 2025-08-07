"use client";

import React from "react";

interface AppMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: AppMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 rounded-md max-w-lg ${
            msg.role === "user"
              ? "bg-blue-100 self-end"
              : "bg-gray-100 self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
