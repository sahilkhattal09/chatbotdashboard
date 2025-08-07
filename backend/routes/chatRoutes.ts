import { Router } from "express";
import {
  createChat,
  getAllChats,
  getChatMessages,
  sendMessage,
  stopGeneration,
} from "../controllers/chatController.js"; // ✅ even though it's a .ts file

const router: Router = Router();

router.post("/chat", createChat);
router.get("/chats", getAllChats);
router.get("/chat/:chatId", getChatMessages);
router.post("/chat/:chatId/message", sendMessage);
router.post("/chat/:chatId/stop", stopGeneration);

export default router;
