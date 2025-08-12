import { useState, useCallback } from "react";

export function useStreamer(url, cancelUrl) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const process = useCallback(
    async (prompt) => {
      setOutput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: prompt }),
        });
        if (!res.ok) throw new Error(`ERROR: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          console.log("Chunk raw length:", value.length);
          const chunkText = decoder.decode(value, { stream: true });
          console.log("Received chunk:", JSON.stringify(chunkText));

          setOutput((val) => val + decoder.decode(value, { stream: true }));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  const cancel = useCallback(async () => {
    try {
      await fetch(cancelUrl, { method: "POST" });
    } catch (err) {
      console.error("Cancel request failed:", err);
    }
  }, [cancelUrl]);

  return { process, cancel, output, isLoading, error };
}
