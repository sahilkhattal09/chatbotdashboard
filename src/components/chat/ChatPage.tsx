"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { ChatSession } from "../../types/chat";
import { ChatMessage } from "../../types/types";

type ChatPageProps = {
  chatId?: string;
};

const BASE_URL = "http://localhost:5000/api";

const ChatPage = ({ chatId: initialChatId }: ChatPageProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    initialChatId ?? null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Fetch chat sessions
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chats`);
        const sessions = res.data.map((chat: any) => ({
          id: chat.id,
          title: chat.title,
          lastUpdated: chat.created_at || chat.createdAt,
        }));
        setChatSessions(sessions);

        if (!initialChatId && sessions.length > 0) {
          setActiveChatId(sessions[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };
    fetchChats();
  }, [initialChatId]);

  // Fetch messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) return;
      try {
        const res = await axios.get(`${BASE_URL}/chat/${activeChatId}`);
        const fetchedMessages: ChatMessage[] = (res.data.messages || []).map(
          (msg: any) => ({
            id: msg.id ?? crypto.randomUUID(),
            role: msg.role,
            content: msg.content,
          })
        );
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  // Create new chat
  const handleNewChat = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/chat`);
      const newChat: ChatSession = {
        id: res.data.chatId,
        title: res.data.title,
        lastUpdated: res.data.createdAt,
      };
      setChatSessions((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create new chat", err);
    }
  };

  // Select chat
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  // Send message (handle plain text backend response)
  const handleSendMessage = async (userMessage: string) => {
    if (!activeChatId) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsSending(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat/${activeChatId}/message`, {
        message: userMessage,
      });

      // Backend returns plain markdown text response here
      const assistantContent = res.data;

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-neutral-100 border-r">
        <ChatSidebar
          chatSessions={chatSessions}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          activeChatId={activeChatId ?? undefined}
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} />
        </div>
        <div className="border-t p-4">
          <MessageInput onSend={handleSendMessage} isLoading={isSending} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
