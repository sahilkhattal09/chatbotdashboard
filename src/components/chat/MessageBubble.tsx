// components/chat/MessageBubble.tsx
"use client";

import React from "react";
import clsx from "clsx";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={clsx("flex", {
        "justify-end": isUser,
        "justify-start": !isUser,
      })}
    >
      <div
        className={clsx(
          "max-w-[75%] px-4 py-2 rounded-lg whitespace-pre-wrap",
          {
            "bg-blue-500 text-white rounded-br-none": isUser,
            "bg-gray-200 text-black rounded-bl-none": !isUser,
          }
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
