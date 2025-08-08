# 🧠 Cointab Chat App Assignment

A local ChatGPT-style full-stack chat application using [Ollama](https://ollama.com/) with the `gemma:1b` model. The app includes chat history, streaming responses, a "Stop" feature, and a clean, intuitive UI inspired by ChatGPT.

---

## 🚀 Features

✅ Chat interface with:

- "New Chat" button
- Chat history (sidebar)
- Streamed message responses (token-by-token)
- Send via button or `Enter`
- Stop button to abort LLM response

✅ Backend with:

- Streaming API connected to Ollama
- Stop functionality via abort signal
- Persistent chat sessions and messages (PostgreSQL)

✅ Database:

- `chats` table → `id`, `title`, `created_at`
- `messages` table → `id`, `chat_id`, `role`, `content`, `timestamp`

✅ Bonus:

- Auto-title chats from first prompt
- "Typing..." indicator
- Retry sending failed messages
- Rename/delete chat (optional)

---

## 🧱 Tech Stack

| Layer    | Stack                        |
| -------- | ---------------------------- |
| Frontend | Next.js (React), TailwindCSS |
| Backend  | Node.js + Express            |
| Database | PostgreSQL                   |
| LLM      | Ollama using `gemma:1b`      |

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/ollama-chat-app.git
cd ollama-chat-app
```

npm run dev:server for running backend
npm run dev for frontend
