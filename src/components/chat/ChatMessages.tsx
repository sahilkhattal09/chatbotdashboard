import React, { useEffect, useRef } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessagesProps = {
  messages: Message[];
  isStreaming: boolean;
};

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isStreaming,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col gap-4 p-4 h-[80vh] overflow-y-auto bg-gray-100">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 rounded-lg max-w-[80%] ${
            msg.role === "user"
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-300 text-black self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}

      {/* Typing Indicator */}
      {isStreaming && (
        <div className="self-start bg-gray-300 text-black p-3 rounded-lg max-w-[80%] flex items-center gap-2">
          <span className="typing-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
