const streamControllers = new Map<string, AbortController>();

type StreamOptions = {
  prompt: string;
  chatId: string;
  onToken: (token: string) => void;
  onEnd: (fullContent: string) => void;
  onAbort: () => void;
};

/**
 * Stream response from Ollama and emit token-by-token
 */
export const generateStreamedResponse = async ({
  prompt,
  chatId,
  onToken,
  onEnd,
  onAbort,
}: StreamOptions): Promise<void> => {
  const controller = new AbortController();
  streamControllers.set(chatId, controller);

  let fullContent = "";

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gemma3:1b", // ✅ Updated model name
        prompt,
        stream: true,
      }),
    });

    if (!res.body) {
      throw new Error("No response body received from Ollama");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        try {
          const json = JSON.parse(line.replace(/^data: /, ""));
          const token = json.response;
          fullContent += token;
          onToken(token);
        } catch (err) {
          console.error("⚠️ Failed to parse LLM stream chunk:", line);
        }
      }
    }

    streamControllers.delete(chatId);
    onEnd(fullContent);
  } catch (err) {
    if (controller.signal.aborted) {
      console.log("⚠️ Stream aborted by user for chat:", chatId);
      onAbort();
    } else {
      console.error("❌ Error during stream:", err);
      onAbort();
    }
  }
};

/**
 * Abort ongoing LLM stream for a specific chat
 */
export const abortStreamByChatId = (chatId: string) => {
  const controller = streamControllers.get(chatId);
  if (controller) {
    controller.abort();
    streamControllers.delete(chatId);
  }
};
