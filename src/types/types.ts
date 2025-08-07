// types/types.ts
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
