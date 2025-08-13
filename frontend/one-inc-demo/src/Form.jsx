import { useState, useEffect } from "react";
import { useStreamer } from "./useStreamer";

export default function Form() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { process, cancel, output, isLoading, error } = useStreamer(
    "/api/generate",
    "/api/cancel"
  );

  // Update currentMessage as chunks come from useStreamer
  useEffect(() => {
    if (isLoading) {
      setCurrentMessage(output);
    }
  }, [output, isLoading]);

  // When stream ends (when isLoading changes) save the currentMessage to messages state and clear it
  useEffect(() => {
    if (!isLoading && currentMessage) {
      setMessages((prev) => [...prev, currentMessage]);
      setCurrentMessage("");
    }
  }, [isLoading, currentMessage]);

  // When a prompt is submitted in the form add the users message to the messages state and process the prompt
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages((prev) => [...prev, prompt]);
    process(prompt);
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto mt-10">
      <div className="flex-1 overflow-y-auto mb-4 px-2">
        {messages.map((msg, idx) => {
          const isUserMessage = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`flex ${
                isUserMessage ? "justify-end" : "justify-start"
              } w-full`}
            >
              <div
                className={`my-2 py-2 px-4 text-white whitespace-pre-wrap w-max max-w-[80%] ${
                  isUserMessage ? "bg-[#164a7f] rounded-3xl" : ""
                }`}
              >
                {msg}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="my-2 p-2 text-white whitespace-pre-wrap">
            {currentMessage}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        {/* Disable the input if useStreamer is loading chunks */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 min-w-[400px] text-white px-6 py-4 rounded-xl focus:outline-none bg-[#164a7f]"
          placeholder="Professional, Casual, Polite, or Something for the Socials..."
          disabled={isLoading}
        />
        {/* If the userStreamer isn't loading render the submit button otherwise render the cancel button */}
        {!isLoading ? (
          <button
            type="submit"
            className="px-6 py-3 bg-[#93D500] text-black rounded-lg font-semibold cursor-pointer transition"
          >
            Process
          </button>
        ) : (
          <button
            type="button"
            onClick={cancel}
            className="px-6 py-3 bg-[#111122] text-white rounded-lg font-semibold cursor-pointer transition"
          >
            Cancel
          </button>
        )}
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </form>
    </div>
  );
}
