import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { ChatMessage } from "../../types/types";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isStreaming,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto h-full">
      {messages.map(({ id, role, content }) => (
        <MessageBubble key={id} role={role} content={content} />
      ))}

      {isStreaming && <MessageBubble role="assistant" content="Typing..." />}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
