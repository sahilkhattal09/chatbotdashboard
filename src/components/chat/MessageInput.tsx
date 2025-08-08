"use client";

import React, { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  isStreaming: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onStop,
  isLoading,
  isStreaming,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-md p-2"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
      />

      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Stop
        </button>
      ) : (
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      )}
    </form>
  );
};

export default MessageInput;
