import type { Request, Response } from "express";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";
import {
  generateStreamedResponse,
  abortStreamByChatId,
} from "../utils/ollama.js"; // ✅ Using streamed response

/**
 * POST /api/chat
 * Create a new chat session
 */
export const createChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🟡 Creating new chat...");
    const chatId = uuidv4();
    const createdAt = new Date();
    const title = `Chat ${createdAt.toISOString().slice(0, 10)}`;

    await pool.query(
      "INSERT INTO chats (id, title, created_at) VALUES ($1, $2, $3)",
      [chatId, title, createdAt]
    );

    console.log("✅ Chat created:", { chatId, title, createdAt });
    res.status(201).json({ chatId, title, createdAt });
  } catch (error) {
    console.error("❌ Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/chats
 * Get list of all chat sessions
 */
export const getAllChats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("📥 Fetching all chat sessions...");
    const result = await pool.query(
      "SELECT id, title, created_at FROM chats ORDER BY created_at DESC"
    );
    console.log("✅ Chats fetched:", result.rows.length, "chats");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/chat/:chatId
 * Get all messages of a chat
 */
export const getChatMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const chatId = req.params.chatId;
  console.log("📥 Fetching messages for chat:", chatId);

  if (!chatId) {
    res.status(400).json({ error: "chatId is required" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, role, content, timestamp FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC",
      [chatId]
    );
    console.log("✅ Messages fetched:", result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/chat/:chatId/message
 * Send a message and stream assistant reply
 */
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const chatId = req.params.chatId;
  const { message } = req.body;

  console.log("📤 Sending user message:", { chatId, message });

  if (!chatId || !message) {
    res.status(400).json({ error: "chatId and message are required" });
    return;
  }

  try {
    const userMessageId = uuidv4();
    const timestamp = new Date();

    // Save user message
    await pool.query(
      "INSERT INTO messages (id, chat_id, role, content, timestamp) VALUES ($1, $2, $3, $4, $5)",
      [userMessageId, chatId, "user", message, timestamp]
    );

    console.log("📝 User message saved to DB");

    // Start streaming response
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    await generateStreamedResponse({
      chatId,
      prompt: message,
      onToken: (token: string) => res.write(token),
      onEnd: async (fullContent: string) => {
        const assistantMessageId = uuidv4();
        const ts = new Date();

        await pool.query(
          "INSERT INTO messages (id, chat_id, role, content, timestamp) VALUES ($1, $2, $3, $4, $5)",
          [assistantMessageId, chatId, "assistant", fullContent, ts]
        );

        console.log("✅ Assistant reply saved and stream ended");
        res.end();
      },
      onAbort: () => {
        console.warn("⚠️ Generation aborted");
        res.end();
      },
    });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/chat/:chatId/stop
 * Abort the ongoing stream for this chat
 */
export const stopGeneration = async (
  req: Request,
  res: Response
): Promise<void> => {
  const chatId = req.params.chatId;
  console.log("🛑 Abort requested for chat:", chatId);

  if (!chatId) {
    res.status(400).json({ error: "chatId is required" });
    return;
  }

  try {
    abortStreamByChatId(chatId);
    console.log("✅ Generation aborted");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error stopping generation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
